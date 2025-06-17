import { login } from '../utils/loginUtils.js'

export const loginAdmin = async(req, res) => {
    login(req, res)
}

export const loginManager = async(req, res) => {
    login(req, res)
}

export const loginWorker = async(req, res) => {
    login(req, res)
}

export const loginCustomer = async(req, res) => {
    login(req, res)
}