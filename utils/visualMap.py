import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as colors


class MapColorControl():
    def __init__(self, colour_scheme, map_normalization,data):
        self.colors = plt.get_cmap(colour_scheme)(range(256))[:,:3]
        self.data = data
        if self.data.min() <= 0:
            self.data = self.data + abs(self.data.min()) + 1
        if map_normalization == "Linear":
            self.normNorm = colors.Normalize(vmin=self.data.min(),vmax=self.data.max())
        elif map_normalization == "Logarithmic":
            self.normNorm = colors.LogNorm(vmin=self.data.min(),vmax=self.data.max())
        elif map_normalization == "Power-law":
            self.normNorm = colors.PowerNorm(gamma=2,vmin=self.data.min(),vmax=self.data.max())

    def get_map_data(self):
        datum = np.round(self.normNorm(self.data) * 255)
        return self.map(datum)

    def map(self,infos):
        datum = []
        for index in infos:
            datum.append(colors.rgb2hex(self.colors[int(index)]))
        return datum


class MapControl():
    def __init__(self,max_value,min_value,map_normalization,data):
        self.data = data
        if self.data.min() <=0:
            self.data = self.data + abs(self.data.min()) +1
        if map_normalization == "Linear":
            self.normNorm = colors.Normalize(vmin=self.data.min(),vmax=self.data.max())
        elif map_normalization == "Logarithmic":
            self.normNorm = colors.LogNorm(vmin=self.data.min(),vmax=self.data.max())
        elif map_normalization == "Power-law":
            self.normNorm = colors.PowerNorm(gamma=2,vmin=self.data.min(),vmax=self.data.max())
        self.maxValue = max_value
        self.minValue = min_value

    def get_map_data(self,is_round):
        if is_round:
            datum = np.round(self.normNorm(self.data) * (self.maxValue-self.minValue) + self.minValue,5)
        else:
            datum = np.round(self.normNorm(self.data) * (self.maxValue - self.minValue) + self.minValue)
        return list(datum)