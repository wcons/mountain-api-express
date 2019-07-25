#!/bin/bash

API="http://localhost:4741"
URL_PATH="/mountains"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "mountain": {
      "name": "'"${NAME}"'",
      "height": "'"${HEIGHT}"'",
      "lat": "'"${LAT}"'",
      "long": "'"${LONG}"'"
    }
  }'

echo
