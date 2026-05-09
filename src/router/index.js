import { createRouter, createWebHistory } from 'vue-router'
import ScanPlateNumber from '@/views/plate_number/ScanPlateNumber.vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import DashboardOverview from '../views/DashboardOverview.vue';
import PriceRuleManagement from '../views/PriceRuleManagement.vue';
//--------------------Vehicle Type-------------------------------
import VehicleTypesManagement from '../views/VehicleTypeManagement.vue';
import VipPlatesManagement from '../views/VipPlateManagement.vue';
import VehicleTypeEditView from '@/views/vehicle_types/VehicleTypeEditView.vue';
import CreateVehicleTypeView from '@/views/vehicle_types/CreateVehicleTypeView.vue';

//----------------------VIP Plate---------------------------------
import CreateVipPlateView from '@/views/vip_plate/CreateVipPlateView.vue';
import EditVipPlateView from '@/views/vip_plate/EditVipPlateView.vue';


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'scan_plate',
      component: ScanPlateNumber,
      meta: {
        title: 'Scan Plate'
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardLayout,
      children: [
        {

          path: '',
          name: 'overview',
          component: DashboardOverview,
          meta: {
            title: 'Overview'
          }
        },
        {
          path: 'price-rules',
          name: 'price-rules',
          component: PriceRuleManagement,
          meta: {
            title: 'Price Rules'
          }
        },
        {
          path: 'vehicle-types',
          name: 'vehicle-types',
          meta: {
            title: 'Vehicle Types'
          },
          children: [
            {
              path: '',
              name: 'vehicle-type.index',
              component: VehicleTypesManagement
            },
            {
              path: ':id/edit',
              name: 'vehicle-type.edit',
              component: VehicleTypeEditView,
              meta: {
                title: 'Edit Type'
              }
            },
            {
              path: 'create',
              name: 'vehicle-type.create',
              component: CreateVehicleTypeView,
              meta: {
                title: 'Create Type'
              }
            }
          ]
        },
        {
          path: 'vip-plates',
          name: 'vip-plates',
          meta: {
            title: 'Vip Plate'
          },
          children: [
            {
              path: '',
              name: 'vip-plates.index',
              component: VipPlatesManagement,
              meta: {
                title: 'VIP Plates'
              }
            },
            {
              path : 'vip-plates',
              name: 'vip-plates.create',
              component: CreateVipPlateView,
              meta:{
                title: 'Add VIP Plate'
              }
              
            },
             {
              path : ':id/edit',
              name: 'vip-plates.edit',
              component: EditVipPlateView,
              meta:{
                title: 'Edit VIP Plate'
              }
              
            }
          ]
        }


      ]
    }
  ]
})
router.beforeEach((to) => {
  document.title = to.meta.title ? to.meta.title + " System" : 'Parking';
  return true;
})
export default router