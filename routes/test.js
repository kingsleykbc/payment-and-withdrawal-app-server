const express = require('express');
const AdModel = require('../models/adModel');

module.exports.getAd = async () => {
  console.log("RAN HERE")
  const ad = await AdModel.findOne();
  return ad;
};

module.exports.createUpdateObject = (updateObject, isArray) => {
  const divider = isArray ? '.$.' : '.';
  const result = {};

  const iterate = (obj, previousKey) => {
    Object.keys(obj).forEach((key) => {
      const newKey = previousKey ? `${previousKey}${divider}${key}` : key;
      if (typeof obj[key] === 'object') iterate(obj[key], newKey);
      else result[newKey] = obj[key];
    });
  };
  iterate(updateObject);

  return result;
};