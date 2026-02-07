-- Add delivery_charge column to cloud_kitchen_slots table
ALTER TABLE public.cloud_kitchen_slots 
ADD COLUMN delivery_charge numeric NOT NULL DEFAULT 0;

-- Add comment for clarity
COMMENT ON COLUMN public.cloud_kitchen_slots.delivery_charge IS 'Delivery charge amount for orders in this division/slot';