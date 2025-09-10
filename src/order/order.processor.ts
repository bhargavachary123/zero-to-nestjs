import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('order')
export class OrderProcessor {
  @Process('send-confirmation')
  async handleOrderConfirmation(job: Job<{ orderId: string; userEmail: string }>) {
    console.log(`📧 Sending confirmation email for order ${job.data.orderId} to ${job.data.userEmail}`);
    await new Promise((res) => setTimeout(res, 2000)); // simulate delay
    console.log(`✅ Confirmation email sent to ${job.data.userEmail}`);
  }

  @Process('update-inventory')
  async handleInventoryUpdate(job: Job<{ productIds: string[] }>) {
    console.log(`📦 Updating inventory for products: ${job.data.productIds.join(', ')}`);
    await new Promise((res) => setTimeout(res, 1000));
    console.log(`✅ Inventory updated`);
  }
}