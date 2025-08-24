import mongoose from 'mongoose';
import Payment from './models/payment.js';
import Order from './models/order.js';

async function testFiltering() {
  try {
    // Connect to the database
    await mongoose.connect('mongodb://localhost:27017/your_database_name', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Get all completed payments for orders
    const paidOrders = await Payment.find({ 
      orderType: 'order', 
      status: 'completed' 
    }).select('orderId');
    
    console.log('Completed payments found:', paidOrders.length);
    console.log('Paid order IDs:', paidOrders.map(p => p.orderId.toString()));
    
    // Get all orders
    const allOrders = await Order.find().select('_id');
    console.log('All orders found:', allOrders.length);
    
    // Extract order IDs that have been paid for
    const paidOrderIds = paidOrders.map(payment => payment.orderId.toString());
    
    // Filter out orders that have been paid for
    const availableOrders = allOrders.filter(order => 
      !paidOrderIds.includes(order._id.toString())
    );
    
    console.log('Available orders after filtering:', availableOrders.length);
    
  } catch (err) {
    console.error('Error testing filtering:', err);
  } finally {
    mongoose.connection.close();
  }
}

testFiltering();
