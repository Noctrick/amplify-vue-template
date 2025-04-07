<template>
  <div>
    <h2>Upload Excel File</h2>
    <input type="file" @change="onFileChange" accept=".xlsx" />
    <button @click="uploadFile" :disabled="!selectedFile">Upload and Process</button>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Storage, API } from "aws-amplify";

const selectedFile = ref<File | null>(null);
const message = ref<string>("");

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
    message.value = `Selected file: ${selectedFile.value.name}`;
  }
}

async function uploadFile() {
  if (!selectedFile.value) return;

  try {
    // Upload the file to S3
    const s3Response = await Storage.put(selectedFile.value.name, selectedFile.value, {
      contentType: selectedFile.value.type,
    });
    console.log("File uploaded:", s3Response.key);
    message.value = "File uploaded. Processing...";

    // Prepare payload for API call (replace with your actual S3 bucket name)
    const apiName = "YourApiName";  // Set this to your API name as configured in Amplify Studio
    const path = "/process";        // Set this to the API endpoint path that triggers your Lambda
    const init = {
      body: {
        bucket: "your-s3-bucket-name", // Replace with your actual S3 bucket name
        key: s3Response.key,
      },
    };

    // Call the API to trigger the Lambda function
    const response = await API.post(apiName, path, init);
    console.log("Processing response:", response);
    message.value = "Processing complete. Check your S3 bucket for output files.";
  } catch (error) {
    console.error("Error during upload or processing:", error);
    message.value = "Error occurred during upload or processing.";
  }
}
</script>
