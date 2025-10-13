import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('order')
export class OrderProcessor {
  // concurrency for this specific processor
  @Process({ name: 'send-confirmation', concurrency: 5 })
  async handleOrderConfirmation(job: Job<{ orderId: string; userEmail: string }>) {
    console.log(`📧 Sending confirmation email for order ${job.data.orderId} to ${job.data.userEmail}`);
    await new Promise((res) => setTimeout(res, 2000)); // simulate delay
    console.log(`✅ Confirmation email sent to ${job.data.userEmail}`);
  }

  @Process({name:'update-inventory', concurrency: 3})
  async handleInventoryUpdate(job: Job<{ productIds: string[] }>) {
    console.log(`📦 Updating inventory for products: ${job.data.productIds.join(', ')}`);
    await new Promise((res) => setTimeout(res, 1000));
    console.log(`✅ Inventory updated`);
  }
}