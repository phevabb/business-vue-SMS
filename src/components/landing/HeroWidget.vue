<template>
    <div
        id="hero"
        class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
        style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.18)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(223, 244, 255) 0%, rgb(227, 236, 255) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
    >
        <div class="mx-6 md:mx-20 mt-0 md:mt-6">
            <h1 class="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                <span class="font-light block">Smarter school operations</span>
                with Phena SMS
            </h1>

            <p class="font-normal text-xl md:text-2xl leading-normal md:mt-4 text-gray-700 max-w-4xl">
                Manage admissions, student records, fees, attendance, results, report cards, class promotion, staff management, parent communication, and more — all in one modern school management platform.
            </p>

            <div class="flex flex-col md:flex-row gap-4 mt-8">
    <Button
        label="Request Demo"
        rounded
        class="!text-xl !px-8 !py-4 !bg-gradient-to-r !from-blue-600 !to-cyan-500 !border-0 !text-white hover:!scale-105 hover:!shadow-2xl transition-all duration-300"
    />

    <Button  as="router-link" to="/auth/register"
        label="Register Your School"
        rounded
        class="!text-xl !px-8 !py-4 !bg-gradient-to-r !from-orange-500 !to-pink-600 !border-0 !text-white hover:!scale-105 hover:!shadow-2xl transition-all duration-300"

    />
</div>
            <div class="mt-8 flex flex-col md:flex-row gap-4 text-lg text-gray-700">
                <div class="flex items-center gap-2">
                    <i class="pi pi-check-circle text-green-600"></i>
                    <span>₵5 per student pricing</span>
                </div>
                <div class="flex items-center gap-2">
                    <i class="pi pi-check-circle text-green-600"></i>
                    <span>Cloud-based access</span>
                </div>
                <div class="flex items-center gap-2">
                    <i class="pi pi-check-circle text-green-600"></i>
                    <span>Built for schools in Ghana</span>
                </div>
            </div>
        </div>

        <div class="flex justify-center md:justify-end mt-8">
            <div class="w-full md:w-10/12 lg:w-8/12 bg-white/70 backdrop-blur-sm shadow-2xl rounded-2xl p-6 mb-8 border border-white/60">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-4">
                        <div class="bg-blue-50 rounded-xl p-4 h-full">
                            <div class="text-sm text-gray-500 mb-2">Students</div>
                            <div class="text-3xl font-bold text-gray-900">2,450</div>
                            <div class="text-green-600 text-sm mt-2">+120 this term</div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-4">
                        <div class="bg-green-50 rounded-xl p-4 h-full">
                            <div class="text-sm text-gray-500 mb-2">Fee Collection</div>
                            <div class="text-3xl font-bold text-gray-900">₵184,500</div>
                            <div class="text-green-600 text-sm mt-2">92% collected</div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-4">
                        <div class="bg-purple-50 rounded-xl p-4 h-full">
                            <div class="text-sm text-gray-500 mb-2">Attendance Today</div>
                            <div class="text-3xl font-bold text-gray-900">96%</div>
                            <div class="text-green-600 text-sm mt-2">Across all classes</div>
                        </div>
                    </div>

                    <div class="col-span-12">
                        <div class="bg-slate-50 rounded-xl p-4">
                            <div class="text-lg font-semibold text-gray-900 mb-2">Everything your school needs in one dashboard</div>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-700">
                                <div class="flex items-center gap-2"><i class="pi pi-users text-blue-600"></i><span>Admissions</span></div>
                                <div class="flex items-center gap-2"><i class="pi pi-credit-card text-green-600"></i><span>Fees & Billing</span></div>
                                <div class="flex items-center gap-2"><i class="pi pi-calendar text-orange-600"></i><span>Attendance</span></div>
                                <div class="flex items-center gap-2"><i class="pi pi-file-edit text-purple-600"></i><span>Results & Reports</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
