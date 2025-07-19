import React from 'react';
import DeliveryTimeline from "@/components/DeliveryTimeline";
import PersonalLayer from "@/layout/MainLayout";

const Page = () => {
	return (
		<PersonalLayer>
			<DeliveryTimeline/>
		</PersonalLayer>
	);
};

export default Page;