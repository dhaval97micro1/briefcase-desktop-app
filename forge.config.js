module.exports = {
  packagerConfig: {
    asar: true,
    icon: "public/images/MyApp.icns",
    osxSign: {},
    osxNotarize: {
      tool: "notarytool",
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.TEAM_ID,
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
