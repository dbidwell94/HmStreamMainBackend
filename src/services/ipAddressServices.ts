import { Repository } from "typeorm";
import IpAddress, { iIpAddressMin } from "../models/ipAddress";
import httpStatus from "http-status-codes";
import { CONNECTION } from "../index";
import { UserServices } from "./userServices";

export class IpAddressError extends Error {
  ipAddress?: IpAddress;
  status?: number;
  constructor(options: {
    message: string;
    ipAddress?: IpAddress;
    status?: number;
  }) {
    const { message, ipAddress, status } = options;
    super(message);
    this.ipAddress = ipAddress;
    this.status = status;
  }
}

export class IpAddressServices {
  ipAddressRepository: Repository<IpAddress>;

  constructor(repository?: Repository<IpAddress>) {
    if (repository) {
      this.ipAddressRepository = repository;
    } else {
      this.ipAddressRepository = CONNECTION.getRepository(IpAddress);
    }
  }

  async getAllAddresses(): Promise<IpAddress[]> {
    const addresses = await this.ipAddressRepository.find();
    if (!addresses || addresses.length < 1) {
      throw new IpAddressError({
        message: "No IP Addresses in the database",
        status: httpStatus.NOT_FOUND,
      });
    }
    return addresses;
  }

  async getAddressById(id: number): Promise<IpAddress> {
    const address = await this.ipAddressRepository.findOne(id);
    if (!address) {
      throw new IpAddressError({
        message: `Ip Address with id ${id} not found`,
        status: httpStatus.NOT_FOUND,
      });
    }
    return address;
  }

  async getAddressByUserId(userId: number): Promise<IpAddress> {
    const userServices = new UserServices();
    // Check if user exists in database
    await userServices.getUserById(userId);
    const address = await this.ipAddressRepository
      .createQueryBuilder()
      .where({ user: userId })
      .getOne();

    if (!address) {
      throw new IpAddressError({
        message: `No ip address found for user id ${userId}`,
        status: httpStatus.NOT_FOUND,
      });
    }

    return address;
  }

  async createIpAddressListingForUser(ipAddress: iIpAddressMin): Promise<void> {
    const userServices = new UserServices();
    ipAddress.address = ipAddress.address.trim();
    const ipAddressChecker = new RegExp(
      /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})$/,
      "gm"
    );
    if (!ipAddressChecker.test(ipAddress.address)) {
      throw new IpAddressError({
        message:
          "The Ip Address sent is not valid. Address must be in format: 'xxx.xxx.xxx.xxx:xxxxx'",
        status: httpStatus.BAD_REQUEST,
      });
    }
    // Verify user exists
    await userServices.getUserById(ipAddress.userId);
    const matches = ipAddressChecker.exec(ipAddress.address);
    const port = Number.parseInt(matches[2]);
    if (port < 1 || port > 65535) {
      throw new IpAddressError({
        message: "Port number not in range of 1 - 65535",
        status: httpStatus.BAD_REQUEST,
      });
    }

    await this.ipAddressRepository.insert(ipAddress);
  }
}
