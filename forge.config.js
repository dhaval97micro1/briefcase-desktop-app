module.exports = {
  packagerConfig: {
    asar: true,
    icon: "public/images/MyApp.icns",
    osxSign: {
      identity: "FunFunFun INC. (7F58LG9JF7)",
    },
    osxNotarize: {
      tool: "notarytool",
      appleId: "dhaval@micro1.ai",
      appleIdPassword: "uokj-eajh-nohp-alcn",
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
