module.exports = {
  packagerConfig: {
    asar: true,
    icon: "public/images/MyApp.icns",
    osxSign: {},
    osxNotarize: {
      tool: "notarytool",
      appleId: "ojas@sycarus.com",
      appleIdPassword: "swey-cgfb-xszl-xaap",
      teamId: "7F58LG9JF7",
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-dmg",
      config: {
        icon: "public/images/MyApp.icns",
      },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {
        icon: "public/images/MyApp.icns",
      },
    },
  ],
};
