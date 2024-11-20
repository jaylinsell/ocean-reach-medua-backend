/*
 * Copyright 2024 RSC-Labs, https://rsoftcon.com/
 *
 * MIT License
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/medusa"
import { OrderStatus } from "@medusajs/medusa";
import { MedusaError, MedusaErrorTypes } from "@medusajs/utils"
import OrdersAnalyticsService from "../../../../../services/ordersAnalytics";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  return res.status(200).json({ kind: req.params.kind });
  const kind = req.params.kind;
  const dateRangeFrom = req.query.dateRangeFrom;
  const dateRangeTo = req.query.dateRangeTo;
  const dateRangeFromCompareTo = req.query.dateRangeFromCompareTo;
  const dateRangeToCompareTo = req.query.dateRangeToCompareTo;
  const orderStatusesFromQuery: string[] = req.query.orderStatuses as string[];

  const orderStatuses: OrderStatus[] = orderStatusesFromQuery !== undefined ?
    orderStatusesFromQuery.map(status => OrderStatus[status.toUpperCase()]).filter(orderStatus => orderStatus !== undefined): [];


  let result;
  const ordersAnalyticsService: OrdersAnalyticsService = req.scope.resolve('ordersAnalyticsService');

  try {
    switch (kind) {
      case 'history':
        result = await ordersAnalyticsService.getOrdersHistory(
          orderStatuses,
          dateRangeFrom ? new Date(Number(dateRangeFrom)) : undefined,
          dateRangeTo ? new Date(Number(dateRangeTo)) : undefined,
          dateRangeFromCompareTo ? new Date(Number(dateRangeFromCompareTo)) : undefined,
          dateRangeToCompareTo ? new Date(Number(dateRangeToCompareTo)) : undefined,
        );
        break;
      case 'count':
        result = await ordersAnalyticsService.getOrdersCount(
          orderStatuses,
          dateRangeFrom ? new Date(Number(dateRangeFrom)) : undefined,
          dateRangeTo ? new Date(Number(dateRangeTo)) : undefined,
          dateRangeFromCompareTo ? new Date(Number(dateRangeFromCompareTo)) : undefined,
          dateRangeToCompareTo ? new Date(Number(dateRangeToCompareTo)) : undefined,
        );
        break;
      case 'payment-provider':
        result = await ordersAnalyticsService.getPaymentProviderPopularity(
          dateRangeFrom ? new Date(Number(dateRangeFrom)) : undefined,
          dateRangeTo ? new Date(Number(dateRangeTo)) : undefined,
          dateRangeFromCompareTo ? new Date(Number(dateRangeFromCompareTo)) : undefined,
          dateRangeToCompareTo ? new Date(Number(dateRangeToCompareTo)) : undefined,
        );
        break;
    }
    res.status(200).json({
      analytics: result
    });
  } catch (error) {
    throw new MedusaError(
      MedusaErrorTypes.DB_ERROR,
      error.message
    )
  }
}

export const AUTHENTICATE = false
