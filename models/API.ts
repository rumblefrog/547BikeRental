export interface RegisterBike {
    id: number,

    public_key: string,

    cost: number,

    description: string,
}

export interface ReturnBike {
    id: number,

    // Data should be hexed for transport
    //encrypted_data: string,
}
