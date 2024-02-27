# mihome-vacuum-map-dl

Using mihome-vacuum-map-dl you can download the map (*.rrmap file) of your vacuum (e.g. Roborock) from xiaomi cloud.

You can open that rrmap-file in [Xiaomi Vacuum Map Viewer](https://community.openhab.org/t/xiaomi-vacuum-map-viewer-to-find-coordinates-for-zone-cleaning/103500) to determine the coordinates of zones that you can then hand over to the command `app_zoned_clean` to clean that zones.

Usually you want to send that command using your home automation software, e.g. Home Assistant ([using the Xiaomi MIIO integration](https://www.home-assistant.io/integrations/xiaomi_miio/))

## Howto

First, ensure git and NodeJS is installed!\
Then, run the following commands:

```
$ git clone https://github.com/da-mkay/mihome-vacuum-map-dl.git
$ cd mihome-vacuum-map-dl
$ npm install
```

Now you can connect to your cloud account and your vacuum and download the map:

```
$ node main.js
Enter email: YOUR_EMAIL
Enter password: YOUR_PASSWORD
Enter server (cn, de, i2, ru, sg, us): de
------------------
Found devices:
------------------
1. Name:     Roborock S7
   Model:    roborock.vacuum.a15
   DID:      ?????????
   Token:    ????????????????????????????????
   IP:       1.2.3.4
------------------
Enter device no: 1
Got map pointer: roboroommap...
Enter output filename: map.rrmap
```

You will end up with a file map.rrmap that you can open in [Xiaomi Vacuum Map Viewer](https://community.openhab.org/t/xiaomi-vacuum-map-viewer-to-find-coordinates-for-zone-cleaning/103500).


## Debug logs

If you need to, you can enable debug logs by setting the `debug` environment variable before running main.js, for example (Unix):

```
$ export debug=true
$ node main.js
...
```

## Credits and Disclaimer

All the hard work was already done by the [iobroker-community-adapters/ioBroker.mihome-vacuum](https://github.com/iobroker-community-adapters/ioBroker.mihome-vacuum). BIG THANK YOU at this point for sharing the code!

Actually, mihome-vacuum-map-dl is a fork of that repository.
I did some minor changes and quickly hacked together a small command line interface for downloading maps.\
There is a big chance that not everything is working as expected or that the code contains bugs or other issues.\
Use at your own risk.
