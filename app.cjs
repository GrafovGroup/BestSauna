// cPanel / CloudLinux Passenger startup entry (CommonJS, including ESM projects).
process.env.NODE_ENV ||= "production";
process.chdir(__dirname);
if (process.env.BESTSAUNA_CONFIG_FILE) process.loadEnvFile(process.env.BESTSAUNA_CONFIG_FILE);
import("./whc/server.mjs").catch(() => {
  console.error("BestSauna startup failed. Check runtime configuration and the private database.");
  process.exitCode = 1;
});
