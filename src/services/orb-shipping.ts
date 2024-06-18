import { AbstractFulfillmentService, Cart } from "@medusajs/medusa"


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
    console.log({optionData, data, cart})
    const freePostCodes = [3922, 3923, 3925]
    const isWithinFreeShippingZone = freePostCodes.includes(Number(cart.shipping_address.postal_code))
    console.log({isWithinFreeShippingZone})
    if (isWithinFreeShippingZone) return 0

    console.log('not free shipping, getting total weight...')
    console.group('weights')
    const totalWeight = cart.items.reduce((acc, item) => {
      console.log({weight: item.variant.weight, qty: item.quantity})
      return acc + (Number(item.variant.weight) * Number(item.quantity));
    }, 0)
    console.groupEnd()

    console.log({totalWeight})

    if (totalWeight < 10) return 500
    console.log('is more than 10kg')

    const weightMultiplier = totalWeight / 1000
    const additionalWeight = weightMultiplier * 500

    console.log({weightMultiplier, additionalWeight, total: 500 + additionalWeight})

    return 500 + additionalWeight
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
    if (data.id !== "orb-shipping") {
      throw new Error("invalid data")
    }

    return {
      ...data,
    }
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

export default orbShippingService
