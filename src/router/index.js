import { createRouter, createWebHistory } from 'vue-router'
import ScanPlateNumber from '@/views/plate_number/ScanPlateNumber.vue';
import { useAuthStore } from '@/stores/auth';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import DashboardOverview from '../views/DashboardOverview.vue';
import PriceRuleManagement from '../views/PriceRuleManagement.vue';
// import { useAuthStore } from '@/stores/auth';
//--------------------Vehicle Type-------------------------------
import VehicleTypesManagement from '../views/VehicleTypeManagement.vue';
import VipPlatesManagement from '../views/VipPlateManagement.vue';
import VehicleTypeEditView from '@/views/vehicle_types/VehicleTypeEditView.vue';
import CreateVehicleTypeView from '@/views/vehicle_types/CreateVehicleTypeView.vue';

//----------------------Login Page--------------------------------
import LoginPageView from '@/views/LoginPageView.vue';
//----------------------VIP Plate---------------------------------
import CreateVipPlateView from '@/views/vip_plate/CreateVipPlateView.vue';
import EditVipPlateView from '@/views/vip_plate/EditVipPlateView.vue';

//-----------------------Price Rules------------------------------
import CreatePriceRuleView from '@/views/price_rules/CreatePriceRuleView.vue';
import EditPriceRuleView from '@/views/price_rules/EditPriceRuleView.vue';

//------------------------System Logs Activity--------------------
import SystemLogsView from '@/views/SystemLogsView.vue';

//-------------------------Customer View--------------------------
// import TripSummary from '@/views/customer_info/CarExitSummaryView.vue';
import ParkingTerminal from '../views/customer_info/ParkingTerminal.vue';

//---------------------------Parking Slots------------------------
import EditParkingSlot from '@/views/slots/EditParkingSlot.vue';

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
      path: '/login',
      name: 'login',
      component: LoginPageView,
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/car-info',
      name: 'car-info',
      component: ParkingTerminal,
      meta: {
        title: 'Car Info'
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
          path: 'system-logs',
          name: 'system-logs',
          component: SystemLogsView,
          meta: {
            title: 'Activity-Logs'
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
              path: 'vip-plates',
              name: 'vip-plates.create',
              component: CreateVipPlateView,
              meta: {
                title: 'Add VIP Plate'
              }

            },
            {
              path: ':id/edit',
              name: 'vip-plates.edit',
              component: EditVipPlateView,
              meta: {
                title: 'Edit VIP Plate'
              }

            }
          ]
        },
        {
          path: 'price-rules',
          name: 'price-rules',
          meta: {
            title: 'Price Rules'
          },
          children: [
            {
              path: '',
              name: 'price-rules.index',
              component: PriceRuleManagement
            },
            {
              path: 'price-rules',
              name: 'price-rules.create',
              component: CreatePriceRuleView
            },
            {
              path: ':id/edit',
              name: 'price-rules.edit',
              component: EditPriceRuleView
            }
          ]
        },
        {
          path: 'slots',
          name: 'slots',
          children: [
            {
              path: ':id/edit',
              name: 'slots.edit',
              component: EditParkingSlot,
              meta: {
                title: 'Edit Slot'
              }
            }
          ]
        }


      ]
    }
  ]
})
router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  document.title = to.meta.title
    ? `${to.meta.title} - My Admin`
    : "My Admin";

  // public routes
  if (to.name === 'scan_plate' || to.name === 'car-info') {
    return true;
  }

  // fetch profile if token exists
  if (authStore.token.value && !authStore.user.value) {
    try {
      await authStore.getProfile();
    } catch (e) {
      authStore.logout();
      return { name: "login" };
    }
  }

  // protect private routes
  if (!authStore.isAuthenticated.value && to.name !== "login") {
    return { name: "login" };
  }

  // prevent logged-in users from visiting login
  if (authStore.isAuthenticated.value && to.name === "login") {
    return { name: "dashboard" };
  }

  return true;
});
export default router