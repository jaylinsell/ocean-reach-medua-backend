import { AbstractFulfillmentService, Cart } from "@medusajs/medusa"
import { CreateReturnType } from "@medusajs/medusa/dist/types/fulfillment-provider"


class orbShippingService extends AbstractFulfillmentService {
  static identifier = "orb-shipping"

  async canCalculate(
    data: Record<string, unknown>
  ): Promise<boolean> {
    return data.id === "orb-shipping"
  }

  async calculatePrice(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    cart: Cart
  ): Promise<number> {
    const freePostCodes = [3922, 3923, 3925]
    const isWithinFreeShippingZone = freePostCodes.includes(Number(cart.shipping_address.postal_code))

    if (isWithinFreeShippingZone) return 0

    const totalWeight = cart.items.reduce((acc, item) => {
      return acc + (item.weight * item.quantity);
    }, 0)

    if (totalWeight < 10) return 5

    const weightMultiplier = totalWeight / 10
    const additionalWeight = weightMultiplier * 5

    return 5 + additionalWeight
  }

  // Not used methods, but required for the class to be valid
  async getFulfillmentOptions(){
    return []
  }

  async validateFulfillmentData(){
    return {}
  }

  async validateOption(
    data: Record<string, unknown>
  ): Promise<boolean> {
    return data.id === "orb-shipping"
  }

  async createFulfillment() {
    return {}
  }

  async cancelFulfillment() {
    return {}
  }

  async createReturn() {
    return {}
  }

  async getFulfillmentDocuments() {
    return {}
  }

  async getReturnDocuments() {
    return {}
  }

  async getShipmentDocuments() {
    return {}
  }

  async retrieveDocuments() {
    return {}
  }
}

// async getFulfillmentOptions(): Promise<any[]> {
//   return [
//     {
//       id: "orb-shipping",
//     }
//   ]
// }

// async validateFulfillmentData(
//   optionData: Record<string, unknown>,
//   data: Record<string, unknown>,
//   cart: Cart
// ): Promise<Record<string, unknown>> {
//   if (data.id !== "orb-shipping") {
//     throw new Error("invalid data")
//   }

//   return {
//     ...data,
//   }
// }

// async validateOption(
//   data: Record<string, unknown>
// ): Promise<boolean> {
//   return data.id === "orb-shipping"
// }

export default orbShippingService
