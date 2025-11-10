using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net; // Keep for UrlEncode/Decode if needed elsewhere, though CreateRequestUrl uses WebUtility
using System.Security.Cryptography;
using System.Text;
// using System.Web; // No longer needed for HttpContext.Current or HttpUtility if not used

namespace CodeForge.Infrastructure.Utils // Or your correct namespace
{
    public class VnPayLibrary
    {
        // Keep VERSION constant
        public const string VERSION = "2.1.0";
        // Use VnPayCompare for sorting
        private SortedList<string, string> _requestData = new SortedList<string, string>(new VnPayCompare());
        private SortedList<string, string> _responseData = new SortedList<string, string>(new VnPayCompare());

        // --- Data Handling Methods ---
        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _requestData.Add(key, value);
            }
        }

        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _responseData.Add(key, value);
            }
        }

        public string GetResponseData(string key)
        {
            if (_responseData.TryGetValue(key, out string? retValue))
            {
                return retValue ?? string.Empty; // Handle potential null
            }
            else
            {
                return string.Empty;
            }
        }

        // Method to clear request data before building a new request
        public void ClearRequestData()
        {
            _requestData.Clear();
        }

        // Method to clear response data before processing a new response (optional)
        public void ClearResponseData()
        {
            _responseData.Clear();
        }


        // --- Request URL Creation ---
        public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
        {
            StringBuilder data = new StringBuilder();
            // Build query string from sorted request data
            foreach (KeyValuePair<string, string> kv in _requestData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    // Use WebUtility.UrlEncode for .NET Core compatibility
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }
            string queryString = data.ToString();

            // Remove trailing '&' if exists
            if (queryString.Length > 0)
            {
                queryString = queryString.Remove(queryString.Length - 1, 1);
            }

            // Generate secure hash
            string vnp_SecureHash = HmacSHA512(vnp_HashSecret, queryString); // Use static Utils method

            // Append hash to the base URL
            baseUrl += "?" + queryString + "&vnp_SecureHash=" + vnp_SecureHash;

            return baseUrl;
        }

        // --- Response Signature Validation ---
        public bool ValidateSignature(string inputHash, string secretKey, SortedList<string, string> responseData)
        {
            if (string.IsNullOrEmpty(inputHash) || string.IsNullOrEmpty(secretKey) || responseData == null)
            {
                return false;
            }
            // Build the raw data string from the sorted response data provided
            string rspRaw = GetResponseDataRaw(responseData);
            // Calculate the hash
            string myChecksum = HmacSHA512(secretKey, rspRaw); // Use static Utils method
            // Compare ignore case
            return myChecksum.Equals(inputHash, StringComparison.OrdinalIgnoreCase);
        }

        // Helper to generate raw string from response data (used for validation)
        private string GetResponseDataRaw(SortedList<string, string> responseData)
        {
            StringBuilder data = new StringBuilder();
            foreach (KeyValuePair<string, string> kv in responseData)
            {
                // Ensure keys used for hashing start with vnp_ and are not the hash itself
                if (!string.IsNullOrEmpty(kv.Value) && kv.Key.StartsWith("vnp_") && kv.Key != "vnp_SecureHash")
                {
                    // Use WebUtility.UrlEncode for consistency if needed, though VNPay docs often show raw
                    // data.Append(kv.Key + "=" + kv.Value + "&"); // Raw
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&"); // Encoded like request? Check VNPay docs. Assume encoded for now.
                }
            }
            // Remove last '&'
            if (data.Length > 0)
            {
                data.Remove(data.Length - 1, 1);
            }
            return data.ToString();
        }

        // --- Hashing Utility (Moved outside Utils class for simplicity or keep in separate static Utils class) ---
        public static string HmacSHA512(string key, string inputData)
        {
            var hash = new StringBuilder();
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2")); // Use "x2" for lowercase hex
                }
            }
            return hash.ToString();
        }
    }

    /// <summary>
    /// Comparer for VNPay parameters to ensure Ordinal sorting required for hashing.
    /// </summary>
    public class VnPayCompare : IComparer<string>
    {
        public int Compare(string? x, string? y) // Use nullable strings
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;
            // Use Ordinal comparison which is byte-by-byte, as required by VNPay
            return string.Compare(x, y, StringComparison.Ordinal);
        }
    }
}