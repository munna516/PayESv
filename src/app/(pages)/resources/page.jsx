import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Resources() {
  return (
    <div className="mt-28">
      <div className="">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">
            Developer Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Integrate our payment gateway into your application with our
            comprehensive API documentation and code examples.
          </p>
        </div>

        {/* API Overview */}
        <Card className="mb-8 dark:bg-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">API</Badge>
              API Overview
            </CardTitle>
            <CardDescription>
              Learn how to integrate our payment gateway using REST API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Base URL</h3>
                <code className="bg-gray-100 px-3 py-2 rounded text-sm dark:bg-slate-700">
                  https://www.payesv.com/api/initiate-payment
                </code>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Required Headers</h3>
                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div>
                      <code className="text-sm">x-api-key: YOUR_API_KEY</code>
                    </div>
                    <div>
                      <code className="text-sm">
                        x-brand-key: YOUR_BRAND_KEY
                      </code>
                    </div>
                    <div>
                      <code className="text-sm">
                        x-api-secret: YOUR_API_SECRET
                      </code>
                    </div>
                    <div>
                      <code className="text-sm">
                        Content-Type: application/json
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Request Body Format (Example)
                </h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  {`{
  "amount": "100",
  "currency": "BDT/USD",
  "customer": {
    "name": "Anis Rahman",
    "email": "anis@gmail.com",
    "phone": "01826673690"
  },
  "orderId": "ord17238",
  "redirectUrl": {
    "success": "https://www.your-domain.com/success",
    "failed": "https://www.your-domain.com/failed"
  }
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card className="dark:bg-slate-700">
          <CardHeader>
            <CardTitle>Integration Examples</CardTitle>
            <CardDescription>
              Choose your preferred programming language to see implementation
              examples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="php" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="php">PHP</TabsTrigger>
                <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                <TabsTrigger value="wordpress">WordPress</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="java">Java</TabsTrigger>
              </TabsList>

              {/* PHP Example */}
              <TabsContent value="php" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    PHP Integration
                  </h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    {`<?php
// Payment Gateway Integration - PHP
class PaymentGateway {
    private $apiKey = 'YOUR_API_KEY';
    private $brandKey = 'YOUR_BRAND_KEY';
    private $apiSecret = 'YOUR_API_SECRET';
    private $baseUrl = 'https://www.payesv.com/api/initiate-payment';

    public function createPayment($amount, $customer, $orderId, $redirectUrls) {
        $data = [
            'amount' => $amount,
            'currency' => 'BDT',
            'customer' => $customer,
            'orderId' => $orderId,
            'redirectUrl' => $redirectUrls
        ];

        $headers = [
            'x-api-key: ' . $this->apiKey,
            'x-brand-key: ' . $this->brandKey,
            'x-api-secret: ' . $this->apiSecret,
            'Content-Type: application/json'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $responseData = json_decode($response, true);
        
        if ($httpCode === 200) {
            return [
                'status' => 'success',
                'message' => $responseData['message'],
                'id' => $responseData['id'],
                'redirectGatewayUrl' => $responseData['redirectGatewayUrl']
            ];
        } else {
            return [
                'status' => 'error',
                'message' => $responseData['message'] ?? 'Request failed'
            ];
        }
    }
}

// Usage Example
$paymentGateway = new PaymentGateway();

$customer = [
    'name' => 'Anis Rahman',
    'email' => 'anis@gmail.com',
    'phone' => '01826673690'
];

$redirectUrls = [
    'success' => 'https://your-domain.com/success',
    'failed' => 'https://your-domain.com/failed'
];

$result = $paymentGateway->createPayment('100', $customer, 'ord17238', $redirectUrls);
echo json_encode($result, JSON_PRETTY_PRINT);
?>`}
                  </pre>
                </div>
              </TabsContent>

              {/* Node.js Example */}
              <TabsContent value="nodejs" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Node.js Integration
                  </h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    {`// Payment Gateway Integration - Node.js
const axios = require('axios');

class PaymentGateway {
    constructor() {
        this.apiKey = 'YOUR_API_KEY';
        this.brandKey = 'YOUR_BRAND_KEY';
        this.apiSecret = 'YOUR_API_SECRET';
        this.baseUrl = 'https://www.payesv.com/api/initiate-payment';
    }

    async createPayment(amount, customer, orderId, redirectUrls) {
        try {
            const data = {
                amount: amount,
                currency: 'BDT',
                customer: customer,
                orderId: orderId,
                redirectUrl: redirectUrls
            };

            const headers = {
                'x-api-key': this.apiKey,
                'x-brand-key': this.brandKey,
                'x-api-secret': this.apiSecret,
                'Content-Type': 'application/json'
            };

            const response = await axios.post(this.baseUrl, data, { headers });
            return {
                status: 'success',
                message: response.data.message,
                id: response.data.id,
                redirectGatewayUrl: response.data.redirectGatewayUrl
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.response?.data?.message || error.message
            };
        }
    }
}

// Usage Example
const paymentGateway = new PaymentGateway();

const customer = {
    name: 'Anis Rahman',
    email: 'anis@gmail.com',
    phone: '01826673690'
};

const redirectUrls = {
    success: 'https://your-domain.com/success',
    failed: 'https://your-domain.com/failed'
};

// Using async/await
async function processPayment() {
    try {
        const result = await paymentGateway.createPayment('100', customer, 'ord17238', redirectUrls);
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Payment failed:', error);
    }
}

processPayment();`}
                  </pre>
                </div>
              </TabsContent>

              {/* WordPress Example */}
              <TabsContent value="wordpress" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    WordPress Integration
                  </h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    {`<?php
// WordPress Payment Gateway Integration
// Add this to your theme's functions.php or create a custom plugin

class WordPressPaymentGateway {
    private $api_key = 'YOUR_API_KEY';
    private $brand_key = 'YOUR_BRAND_KEY';
    private $api_secret = 'YOUR_API_SECRET';
    private $base_url = 'https://www.payesv.com/api/initiate-payment';

    public function __construct() {
        add_action('wp_ajax_create_payment', array($this, 'create_payment'));
        add_action('wp_ajax_nopriv_create_payment', array($this, 'create_payment'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
    }

    public function create_payment() {
        // Verify nonce for security
        if (!wp_verify_nonce($_POST['nonce'], 'payment_nonce')) {
            wp_die('Security check failed');
        }

        $amount = sanitize_text_field($_POST['amount']);
        $customer = array(
            'name' => sanitize_text_field($_POST['customer_name']),
            'email' => sanitize_email($_POST['customer_email']),
            'phone' => sanitize_text_field($_POST['customer_phone'])
        );
        $order_id = sanitize_text_field($_POST['order_id']);

        $data = array(
            'amount' => $amount,
            'currency' => 'BDT',
            'customer' => $customer,
            'orderId' => $order_id,
            'redirectUrl' => array(
                'success' => home_url('/payment-success'),
                'failed' => home_url('/payment-failed')
            )
        );

        $headers = array(
            'x-api-key: ' . $this->api_key,
            'x-brand-key: ' . $this->brand_key,
            'x-api-secret: ' . $this->api_secret,
            'Content-Type: application/json'
        );

        $response = wp_remote_post($this->base_url, array(
            'headers' => $headers,
            'body' => json_encode($data),
            'timeout' => 30
        ));

        if (is_wp_error($response)) {
            wp_send_json_error('Payment request failed');
        } else {
            $body = wp_remote_retrieve_body($response);
            $result = json_decode($body, true);
            
            if (wp_remote_retrieve_response_code($response) === 200) {
                wp_send_json_success([
                    'message' => $result['message'],
                    'id' => $result['id'],
                    'redirectGatewayUrl' => $result['redirectGatewayUrl']
                ]);
            } else {
                wp_send_json_error($result['message'] ?? 'Payment failed');
            }
        }
    }

    public function enqueue_scripts() {
        wp_enqueue_script('payment-gateway', get_template_directory_uri() . '/js/payment-gateway.js', array('jquery'), '1.0', true);
        wp_localize_script('payment-gateway', 'payment_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('payment_nonce')
        ));
    }
}

// Initialize the payment gateway
new WordPressPaymentGateway();

// JavaScript for frontend (save as js/payment-gateway.js)
/*
jQuery(document).ready(function($) {
    $('#payment-form').on('submit', function(e) {
        e.preventDefault();
        
        var formData = {
            action: 'create_payment',
            nonce: payment_ajax.nonce,
            amount: $('#amount').val(),
            customer_name: $('#customer_name').val(),
            customer_email: $('#customer_email').val(),
            customer_phone: $('#customer_phone').val(),
            order_id: 'ord_' + Date.now()
        };

        $.post(payment_ajax.ajax_url, formData, function(response) {
            if (response.success) {
                window.location.href = response.data.redirect_url;
            } else {
                alert('Payment failed: ' + response.data);
            }
        });
    });
});
*/
?>`}
                  </pre>
                </div>
              </TabsContent>

              {/* Python Example */}
              <TabsContent value="python" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Python Integration
                  </h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    {`# Payment Gateway Integration - Python
import requests
import json

class PaymentGateway:
    def __init__(self):
        self.api_key = 'YOUR_API_KEY'
        self.brand_key = 'YOUR_BRAND_KEY'
        self.api_secret = 'YOUR_API_SECRET'
        self.base_url = 'https://www.payesv.com/api/initiate-payment'

    def create_payment(self, amount, customer, order_id, redirect_urls):
        data = {
            'amount': amount,
            'currency': 'BDT',
            'customer': customer,
            'orderId': order_id,
            'redirectUrl': redirect_urls
        }

        headers = {
            'x-api-key': self.api_key,
            'x-brand-key': self.brand_key,
            'x-api-secret': self.api_secret,
            'Content-Type': 'application/json'
        }

        try:
            response = requests.post(
                self.base_url,
                json=data,
                headers=headers,
                timeout=30
            )
            
            response_data = response.json()
            return {
                'status': 'success',
                'message': response_data['message'],
                'id': response_data['id'],
                'redirectGatewayUrl': response_data['redirectGatewayUrl']
            }
        except requests.exceptions.RequestException as e:
            return {
                'status': 'error',
                'message': str(e)
            }

# Usage Example
if __name__ == "__main__":
    payment_gateway = PaymentGateway()
    
    customer = {
        'name': 'Anis Rahman',
        'email': 'anis@gmail.com',
        'phone': '01826673690'
    }
    
    redirect_urls = {
        'success': 'https://your-domain.com/success',
        'failed': 'https://your-domain.com/failed'
    }
    
    result = payment_gateway.create_payment('100', customer, 'ord17238', redirect_urls)
    print(json.dumps(result, indent=2))

# Django Integration Example
"""
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def create_payment_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            payment_gateway = PaymentGateway()
            result = payment_gateway.create_payment(
                amount=data['amount'],
                customer=data['customer'],
                order_id=data['order_id'],
                redirect_urls=data['redirect_urls']
            )
            
            return JsonResponse(result)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
"""

# Flask Integration Example
"""
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/create-payment', methods=['POST'])
def create_payment():
    try:
        data = request.get_json()
        
        payment_gateway = PaymentGateway()
        result = payment_gateway.create_payment(
            amount=data['amount'],
            customer=data['customer'],
            order_id=data['order_id'],
            redirect_urls=data['redirect_urls']
        )
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
"""`}
                  </pre>
                </div>
              </TabsContent>

              {/* Java Example */}
              <TabsContent value="java" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Java Integration
                  </h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    {`// Payment Gateway Integration - Java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.HashMap;

public class PaymentGateway {
    private String apiKey = "YOUR_API_KEY";
    private String brandKey = "YOUR_BRAND_KEY";
    private String apiSecret = "YOUR_API_SECRET";
    private String baseUrl = "https://www.payesv.com/api/initiate-payment";
    private ObjectMapper objectMapper = new ObjectMapper();

    public PaymentResponse createPayment(String amount, Customer customer, 
                                      String orderId, RedirectUrl redirectUrl) {
        try {
            // Create request data
            Map<String, Object> requestData = new HashMap<>();
            requestData.put("amount", amount);
            requestData.put("currency", "BDT");
            requestData.put("customer", customer);
            requestData.put("orderId", orderId);
            requestData.put("redirectUrl", redirectUrl);

            String jsonBody = objectMapper.writeValueAsString(requestData);

            // Create HTTP request
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl))
                .header("x-api-key", apiKey)
                .header("x-brand-key", brandKey)
                .header("x-api-secret", apiSecret)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

            // Send request
            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, 
                HttpResponse.BodyHandlers.ofString());

            // Parse response
            PaymentResponse paymentResponse = new PaymentResponse();
            Map<String, Object> responseData = objectMapper.readValue(
                response.body(), Map.class);
            
            if (response.statusCode() == 200) {
                paymentResponse.setStatus("success");
                paymentResponse.setMessage((String) responseData.get("message"));
                paymentResponse.setId((String) responseData.get("id"));
                paymentResponse.setRedirectGatewayUrl((String) responseData.get("redirectGatewayUrl"));
            } else {
                paymentResponse.setStatus("error");
                paymentResponse.setMessage((String) responseData.get("message"));
            }

            return paymentResponse;

        } catch (IOException | InterruptedException e) {
            PaymentResponse errorResponse = new PaymentResponse();
            errorResponse.setStatusCode(500);
            errorResponse.setError(e.getMessage());
            return errorResponse;
        }
    }

    // Data classes
    public static class Customer {
        private String name;
        private String email;
        private String phone;

        // Constructors
        public Customer() {}
        
        public Customer(String name, String email, String phone) {
            this.name = name;
            this.email = email;
            this.phone = phone;
        }

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }

    public static class RedirectUrl {
        private String success;
        private String failed;

        // Constructors
        public RedirectUrl() {}
        
        public RedirectUrl(String success, String failed) {
            this.success = success;
            this.failed = failed;
        }

        // Getters and Setters
        public String getSuccess() { return success; }
        public void setSuccess(String success) { this.success = success; }
        
        public String getFailed() { return failed; }
        public void setFailed(String failed) { this.failed = failed; }
    }

    public static class PaymentResponse {
        private String status;
        private String message;
        private String id;
        private String redirectGatewayUrl;

        // Getters and Setters
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getRedirectGatewayUrl() { return redirectGatewayUrl; }
        public void setRedirectGatewayUrl(String redirectGatewayUrl) { this.redirectGatewayUrl = redirectGatewayUrl; }
    }
}

// Usage Example
public class PaymentExample {
    public static void main(String[] args) {
        PaymentGateway paymentGateway = new PaymentGateway();
        
        PaymentGateway.Customer customer = new PaymentGateway.Customer(
            "Anis Rahman", 
            "anis@gmail.com", 
            "01826673690"
        );
        
        PaymentGateway.RedirectUrl redirectUrl = new PaymentGateway.RedirectUrl(
            "https://your-domain.com/success",
            "https://your-domain.com/failed"
        );
        
        PaymentGateway.PaymentResponse response = paymentGateway.createPayment(
            "100", customer, "ord17238", redirectUrl
        );
        
        System.out.println("Status: " + response.getStatus());
        System.out.println("Message: " + response.getMessage());
        if (response.getStatus().equals("success")) {
            System.out.println("Transaction ID: " + response.getId());
            System.out.println("Redirect URL: " + response.getRedirectGatewayUrl());
        }
    }
}

// Spring Boot Integration Example
/*
@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    
    private PaymentGateway paymentGateway = new PaymentGateway();
    
    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest request) {
        try {
            PaymentGateway.Customer customer = new PaymentGateway.Customer(
                request.getCustomer().getName(),
                request.getCustomer().getEmail(),
                request.getCustomer().getPhone()
            );
            
            PaymentGateway.RedirectUrl redirectUrl = new PaymentGateway.RedirectUrl(
                request.getRedirectUrl().getSuccess(),
                request.getRedirectUrl().getFailed()
            );
            
            PaymentGateway.PaymentResponse response = paymentGateway.createPayment(
                request.getAmount(),
                customer,
                request.getOrderId(),
                redirectUrl
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
*/`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-6 mt-8 dark:bg-slate-700">
          <Card className="dark:bg-slate-700">
            <CardHeader>
              <CardTitle>Success Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                {`{
  "message": "Payment initiated successfully",
  "id": "transaction_id_here",
  "redirectGatewayUrl": "https://checkout.payesv.com/pay/transaction_id_here"
}`}
              </pre>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-700">
            <CardHeader>
              <CardTitle>Error Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-red-400 p-4 rounded-lg overflow-x-auto text-sm">
                {`{
  "status": "error",
  "message": "Invalid API Key or API Secret or Brand Key"
}`}
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Security & Best Practices */}
        <Card className="mt-8 dark:bg-slate-700">
          <CardHeader>
            <CardTitle>Security & Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">
                  🔐 Security Guidelines
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Never expose your API credentials in client-side code</li>
                  <li>Use HTTPS for all API communications</li>
                  <li>Implement proper input validation and sanitization</li>
                  <li>
                    Store sensitive data securely using environment variables
                  </li>
                  <li>Implement rate limiting to prevent abuse</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-lg mb-2">
                  ✅ Best Practices
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Always handle API responses and errors gracefully</li>
                  <li>
                    Implement webhook notifications for payment status updates
                  </li>
                  <li>Use unique order IDs for each transaction</li>
                  <li>
                    Test thoroughly in sandbox environment before going live
                  </li>
                  <li>Implement proper logging for debugging and monitoring</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
