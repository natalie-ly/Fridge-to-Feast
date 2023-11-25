//'use strict';

// const async = require('async');
// const fs = require('fs');
// const https = require('https');
// const path = require("path");
// const createReadStream = require('fs').createReadStream
// const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */

const key = process.env.REACT_APP_VISION_KEY;
const endpoint = 'https://image-tag-project.cognitiveservices.azure.com/';

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);
/**
 * END - Authenticate
 */

// For image URL
export default async function computerVision(tagsURL) {
    try{
      /**
       * DETECT TAGS  
       * Detects tags for an image, which returns:
       *     all objects in image and confidence score.
       */
      console.log('-------------------------------------------------');
      console.log('DETECT TAGS');
      console.log();

      // Analyze URL image
      const tags = (await computerVisionClient.analyzeImage(tagsURL, { visualFeatures: ['Tags'] })).tags;
      console.log(`Tags: ${formatTags(tags)}`);

      // Format tags for display
      function formatTags(tags) {
        return tags.map(tag => (`${tag.name} (${tag.confidence.toFixed(2)})`)).join(', ');
      }

      const tagsString = formatTags(tags);

      return tagsString;
    } catch (error) {
      throw error;
    }
}

computerVision();