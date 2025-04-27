/**
 * Utility function to print all environment variables
 * Shows all variables including sensitive information
 */
export function printEnvironmentVariables() {
  const envVars = process.env;

  // Print in a formatted way
  console.log("\nEnvironment Variables:");
  console.log("=====================");
  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`${key}: ${value || "undefined"}`);
  });
  console.log("=====================\n");
}
