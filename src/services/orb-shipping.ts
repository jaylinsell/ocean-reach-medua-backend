import { AbstractFulfillmentService, Cart } from "@medusajs/medusa"


class orbShippingService extends AbstractFulfillmentService {
  static identifier = "orb-shipping"

  async canCalculate() {
    return true
  }

  async calculatePrice(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    cart: Cart
  ): Promise<number> {
    const freePostCodes = ['3922', '3923', '3925']
    const isWithinFreeShippingZone = freePostCodes.includes(cart.shipping_address.postal_code)

    if (isWithinFreeShippingZone) return 0

    const totalWeight = cart.items.reduce((acc, item) => {
      console.log({weight: item.variant.weight, qty: item.quantity})
      return acc + (Number(item.variant.weight) * Number(item.quantity));
    }, 0)

    // every time this interval amount is hit, we'll multiply against it. Ie, we want to add $5 every time this is 10 (10kg)
    const weightIntervalAmount = 10
    const basePrice = 500

    if (totalWeight < weightIntervalAmount) return basePrice

    const weightMultiplier = Math.floor(totalWeight / weightIntervalAmount)
    const additionalWeight = weightMultiplier * basePrice

    return basePrice + additionalWeight
  }

  // Not used methods, but required for the class to be valid
  async getFulfillmentOptions(): Promise<any[]> {
    return [
      {
        id: "orb-shipping",
      }
    ]
  }

  async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    cart: Cart
  ): Promise<Record<string, unknown>> {
    return data
  }

  async validateOption() {
    return true
  }

  async createFulfillment() {
    return Promise.resolve({})
  }

  async cancelFulfillment() {
    return Promise.resolve({})
  }

  async createReturn() {
    return Promise.resolve({})
  }

  async getFulfillmentDocuments() {
    return Promise.resolve({})
  }

  async getReturnDocuments() {
    return Promise.resolve({})
  }

  async getShipmentDocuments() {
    return Promise.resolve({})
  }

  async retrieveDocuments() {
    return Promise.resolve([])
  }
}

export default orbShippingService
