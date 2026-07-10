import { AppRegistry } from "react-native";
  import App from "./app/App";
  const { name: appName } = require('./app.json');

  AppRegistry.registerComponent(appName, () => App);