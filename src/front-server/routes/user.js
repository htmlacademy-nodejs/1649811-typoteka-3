'use strict';

const express = require(`express`);
const path = require(`path`);
const fs = require(`fs`).promises;
const api = require(`../api`).getApi();
const {asyncWrapper} = require(`../utils`);
const {emptyUser, getRequestData, absoluteUploadDir, upload} = require(`./user-helper`);
const router = new express.Router();

const PUBLIC_IMG_DIR = `../public/img`;

router.get(`/register`, asyncWrapper(async (req, res) => {
		res.render(`main/sign-up`, {user: {...emptyUser}, errorMessages: null});
}));

router.post(`/register`, upload.single(`avatar`), asyncWrapper(async (req, res) => {
		const {file} = req;
		const [isPictureExist, user] = getRequestData(req);
		
		if (isPictureExist) {
				user.avatar = file.filename;
		}
		
		try {
				await api.createUser(user);
				
				if (isPictureExist) {
						
						await fs.copyFile(
								path.resolve(absoluteUploadDir, user.avatar),
								path.resolve(__dirname, PUBLIC_IMG_DIR, user.avatar)
						);
						
						await fs.unlink(path.resolve(absoluteUploadDir, user.avatar));
				}
				
				res.redirect(`/login`);
		} catch (error) {
				const {message: errorMessages} = error.response.data;
				res.render(`main/sign-up`, {user, errorMessages});
		}
}));

router.get(`/login`, asyncWrapper(async (req, res) => {
		const user = {email: ``, password: ``};
		res.render(`main/login`, {user});
}));

module.exports = router;
