'use client'
import React from 'react';
import { motion } from 'framer-motion';
import {deliveryOptions} from "../../public/assets/data/deliveryOptions";

const DeliveryTimeline = () => {
	return (
		<>
			<div className="h-auto bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-white">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="max-w-7xl mx-auto"
				>
					<div className="text-center mb-16">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">Сроки доставки</h1>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Узнайте доступные способы получения вашего заказа и ориентировочные сроки
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
						{deliveryOptions.map((option, index) => (
							<motion.div
								key={index}
								whileHover={{ y: -5 }}
								className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
							>
								<div className="text-4xl mb-4">{option.icon}</div>
								<h3 className="text-xl font-semibold mb-2">{option.title}</h3>
								<div className="flex items-center mb-2">
									<span className="text-gray-500 mr-2">⏱</span>
									<span className="font-medium">{option.time}</span>
								</div>
								<div className="flex items-center mb-3">
									<span className="text-gray-500 mr-2">💰</span>
									<span className="font-medium">{option.price}</span>
								</div>
								<p className="text-gray-600">{option.description}</p>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</>
	);
};

export default DeliveryTimeline;