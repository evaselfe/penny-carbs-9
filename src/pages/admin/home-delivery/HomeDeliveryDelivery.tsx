import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Truck, Phone, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface HomeDeliveryDeliveryProps {
  onBack: () => void;
}

const HomeDeliveryDelivery: React.FC<HomeDeliveryDeliveryProps> = ({ onBack }) => {
  const { data: deliveryStaff, isLoading } = useQuery({
    queryKey: ['home-delivery-staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_staff')
        .select('*, panchayats!delivery_staff_panchayat_id_fkey(name)')
        .eq('is_approved', true)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const activeCount = deliveryStaff?.filter(s => s.is_available).length || 0;
  const totalCount = deliveryStaff?.length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">Delivery Staff</h2>
          <p className="text-sm text-muted-foreground">
            {activeCount} active / {totalCount} total staff
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Total Staff</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{totalCount - activeCount}</p>
            <p className="text-xs text-muted-foreground">Offline</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Approved Delivery Staff
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : deliveryStaff?.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No approved delivery staff found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Panchayat</TableHead>
                    <TableHead>Deliveries</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryStaff?.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {staff.mobile_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="text-sm">{staff.vehicle_type}</span>
                          {staff.vehicle_number && (
                            <p className="text-xs text-muted-foreground">{staff.vehicle_number}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(staff as any).panchayats?.name ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="text-sm">{(staff as any).panchayats.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell>{staff.total_deliveries || 0}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={staff.is_available ? 'default' : 'secondary'}>
                          {staff.is_available ? 'Available' : 'Offline'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeDeliveryDelivery;
