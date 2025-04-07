import { defineFunction } from "@aws-amplify/backend";

export const excel = defineFunction({
  entry: "./handler.py",
  runtime: "python3.8" as any, // Use 'as any' to bypass type checking for runtime
});
