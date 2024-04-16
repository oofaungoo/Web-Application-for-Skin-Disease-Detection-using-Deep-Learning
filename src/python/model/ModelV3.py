import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision
import torchvision.models as models
import torchvision.transforms as transforms
import torch.optim as optim
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader, Dataset, random_split, SubsetRandomSampler
from torchvision.models import resnet50
from torch.utils.data import DataLoader

from PIL import Image
import matplotlib.pyplot as plt 
#python -m pip install -U pip
#python -m pip install -U matplotlib
import numpy as np
import os
import cv2 #pip install opencv-python opencv-python-headless

class ConvBnRelu(nn.Module):
    def __init__(self,
                 in_channels: int,
                 out_channels: int,
                 kernel_size: int,
                 stride: int = 1,
                 padding: int = 0,
                 dilation: int = 1,
                 groups: int = 1,
                 add_bn: bool = True,
                 add_relu: bool = True,
                 bias: bool = True,
                 interpolate: bool = False):
        super(ConvBnRelu, self).__init__()
        self.conv = nn.Conv2d(in_channels=in_channels,
                              out_channels=out_channels,
                              kernel_size=kernel_size,
                              stride=stride,
                              padding=padding,
                              dilation=dilation,
                              bias=bias,
                              groups=groups)
        self.add_relu = add_relu
        self.add_bn = add_bn
        self.interpolate = interpolate
        if add_bn:
            self.bn = nn.BatchNorm2d(out_channels)
        if add_relu:
            self.activation = nn.ReLU(inplace=True)

    def forward(self, x):
      x = self.conv(x)
      if self.add_bn:
          x = self.bn(x)
      if self.add_relu:
          x = self.activation(x)
      if self.interpolate:
          x = F.interpolate(x,
                            scale_factor=2,
                            mode='bilinear',
                            align_corners=True)
      return x

class PyramidAttention(nn.Module):
    def __init__(
        self,
        in_channels,
        out_channels,
        use_pa: bool = True,
        upscale_mode='bilinear',
        align_corners=True,
    ):
        super(PyramidAttention, self).__init__()

        self.upscale_mode = upscale_mode
        self.align_corners = align_corners if upscale_mode == 'bilinear' else None
        self.use_pa = use_pa

        # middle branch
        self.mid = nn.Sequential(
            ConvBnRelu(
                in_channels=in_channels,
                out_channels=out_channels,
                kernel_size=1,
                stride=1,
                padding=0,
            ))

        # pyramid attention branch
        if use_pa:
            self.down1 = nn.Sequential(
                nn.MaxPool2d(kernel_size=2, stride=2),
                ConvBnRelu(in_channels=in_channels,
                           out_channels=1,
                           kernel_size=7,
                           stride=1,
                           padding=3))
            self.down2 = nn.Sequential(
                nn.MaxPool2d(kernel_size=2, stride=2),
                ConvBnRelu(in_channels=1,
                           out_channels=1,
                           kernel_size=5,
                           stride=1,
                           padding=2))
            self.down3 = nn.Sequential(
                nn.MaxPool2d(kernel_size=2, stride=2),
                ConvBnRelu(in_channels=1,
                           out_channels=1,
                           kernel_size=3,
                           stride=1,
                           padding=1))

            self.conv3 = ConvBnRelu(in_channels=1,
                                    out_channels=1,
                                    kernel_size=3,
                                    stride=1,
                                    padding=1)
            self.conv2 = ConvBnRelu(in_channels=1,
                                    out_channels=1,
                                    kernel_size=5,
                                    stride=1,
                                    padding=2)
            self.conv1 = ConvBnRelu(in_channels=1,
                                    out_channels=1,
                                    kernel_size=7,
                                    stride=1,
                                    padding=3)

    def forward(self, x):
      upscale_parameters = dict(mode=self.upscale_mode,
                                  align_corners=self.align_corners)

      mid = self.mid(x)

      if self.use_pa:
          x1 = self.down1(x)
          x2 = self.down2(x1)
          x3 = self.down3(x2)
          x = F.interpolate(self.conv3(x3),
                            scale_factor=2,
                            **upscale_parameters)
          x = F.interpolate(self.conv2(x2) + x,
                            scale_factor=2,
                            **upscale_parameters)
          x = F.interpolate(self.conv1(x1) + x,
                            scale_factor=2,
                            **upscale_parameters)
          x = torch.mul(x, mid)
      else:
          x = mid
      return x

class UpSample(nn.Module):
    def __init__(
        self,
        in_channels: int,
        out_channels: int,
        up_type: str = '2layer',
        kernel_size: int = 1,
        upscale_mode: str = 'bilinear',
        align_corners=True,
    ):
        super(UpSample, self).__init__()

        self.upscale_mode = upscale_mode
        self.align_corners = align_corners if upscale_mode == 'bilinear' else None

        self.conv = nn.Conv2d(in_channels= in_channels,
                              out_channels=128,
                              kernel_size=1,
                              )

        if up_type == '1layer':
            self.conv1 = ConvBnRelu(
                in_channels=in_channels,
                out_channels=out_channels,
                kernel_size=kernel_size,
                padding=kernel_size // 2,
            )
        elif up_type == '2layer':
            self.conv1 = nn.Sequential(
                ConvBnRelu(
                    in_channels=in_channels,
                    out_channels=in_channels,
                    kernel_size=kernel_size,
                    padding=kernel_size // 2,
                ),
                ConvBnRelu(
                    in_channels=in_channels,
                    out_channels=out_channels,
                    kernel_size=kernel_size,
                    padding=kernel_size // 2,
                ),
            )
        else:
            raise NotImplementedError()

    def forward(self, x, y):
        """
        Args:
            x: low level feature
            y: high level feature
        """
        h, w = x.size(2), x.size(3)
        y_up = F.interpolate(y,
                             size=(h, w),
                             mode=self.upscale_mode,
                             align_corners=self.align_corners)
        conv = self.conv1(x)
        return y_up + conv

class Pylon(nn.Module):
    def __init__(self, n_classes):
        super().__init__()
        base_model = resnet50(pretrained=True)
        self.initial_conv = nn.Sequential(
            base_model.conv1,
            base_model.bn1,
            base_model.relu,
            base_model.maxpool
        )

        self.encoder1 = base_model.layer1
        self.encoder2 = base_model.layer2
        self.encoder3 = base_model.layer3
        self.encoder4 = base_model.layer4

        self.conv3 = nn.Conv2d(in_channels= 1024,
                              out_channels=128,
                              kernel_size=1,
                              )
        
        self.conv2 = nn.Conv2d(in_channels= 512,
                              out_channels=128,
                              kernel_size=1,
                              )
        
        self.conv1 = nn.Conv2d(in_channels= 256,
                              out_channels=128,
                              kernel_size=1,
                              )

        self.pyramid_attention = PyramidAttention(in_channels=2048, out_channels=128)
        self.up3 = UpSample(in_channels=128,out_channels=128)
        self.up2 = UpSample(in_channels=128,out_channels=128)
        self.up1 = UpSample(in_channels=128,out_channels=128)

        # Add Global Average Pooling
        self.global_avg_pool = nn.AdaptiveAvgPool2d((1, 1))

        # Final classification layer
        self.classifier = nn.Linear(128, n_classes)  # Assuming '64' is the output channel count of the last UpSample

    def forward(self, x):
        x = self.initial_conv(x)
        x1 = self.encoder1(x)
        x2 = self.encoder2(x1)
        x3 = self.encoder3(x2)
        x4 = self.encoder4(x3)

        x3 = self.conv3(x3)
        x2 = self.conv2(x2)
        x1 = self.conv1(x1)

        x = self.pyramid_attention(x4)
        x = self.up3(x3, x)
        x = self.up2(x2, x)
        x = self.up1(x1, x)

        # Global Average Pooling before the classifier
        x = self.global_avg_pool(x)
        x = torch.flatten(x, 1)  # Flatten the features for the classifier
        x = self.classifier(x)

        return x