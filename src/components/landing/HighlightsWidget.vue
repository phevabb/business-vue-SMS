<template>
    <div id="highlights" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
        <div class="text-center">
            <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Built for School Growth</div>
            <span class="text-muted-color text-2xl">From a single campus to a growing school group, Phena scales with you.</span>
        </div>

        <div class="grid grid-cols-12 gap-4 mt-20 pb-2 md:pb-20">
            <div class="flex justify-center col-span-12 lg:col-span-6 bg-blue-50 p-8 order-1 lg:order-none" style="border-radius: 8px">
                <div class="w-full bg-white rounded-2xl shadow-lg p-6">
                    <div class="text-2xl font-semibold text-gray-900 mb-4">Centralised Student Information</div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-slate-50 rounded-xl p-4">
                            <div class="text-sm text-gray-500">Current Enrolment</div>
                            <div class="text-2xl font-bold text-gray-900 mt-2">3,128</div>
                        </div>
                        <div class="bg-slate-50 rounded-xl p-4">
                            <div class="text-sm text-gray-500">Classes</div>
                            <div class="text-2xl font-bold text-gray-900 mt-2">48</div>
                        </div>
                        <div class="bg-slate-50 rounded-xl p-4">
                            <div class="text-sm text-gray-500">Staff</div>
                            <div class="text-2xl font-bold text-gray-900 mt-2">154</div>
                        </div>
                        <div class="bg-slate-50 rounded-xl p-4">
                            <div class="text-sm text-gray-500">Campuses</div>
                            <div class="text-2xl font-bold text-gray-900 mt-2">4</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-6 my-auto flex flex-col lg:items-end text-center lg:text-right gap-4">
                <div class="flex items-center justify-center bg-blue-100 self-center lg:self-end" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                    <i class="pi pi-fw pi-database !text-4xl text-blue-700"></i>
                </div>
                <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">One Reliable Source of Truth</div>
                <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal ml-0 md:ml-2" style="max-width: 650px">
                    Keep admissions, academics, fees, and administrative data in one secure system so your team always works with accurate, up-to-date information.
                </span>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-4 my-20 pt-2 md:pt-20">
            <div class="col-span-12 lg:col-span-6 my-auto flex flex-col text-center lg:text-left lg:items-start gap-4">
                <div class="flex items-center justify-center bg-green-100 self-center lg:self-start" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                    <i class="pi pi-fw pi-chart-line !text-3xl text-green-700"></i>
                </div>
                <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">Better Visibility for School Leaders</div>
                <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal mr-0 md:mr-2" style="max-width: 650px">
                    Get instant access to fee performance, attendance trends, enrolment numbers, academic summaries, and other key indicators that help you make faster decisions.
                </span>
            </div>

            <div class="flex justify-end order-1 sm:order-2 col-span-12 lg:col-span-6 bg-green-50 p-8" style="border-radius: 8px">
                <div class="w-full bg-white rounded-2xl shadow-lg p-6">
                    <div class="text-2xl font-semibold text-gray-900 mb-4">Executive Overview</div>
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-gray-600">Fee Collection</span>
                                <span class="font-semibold text-gray-900">92%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="bg-green-500 h-3 rounded-full" style="width: 92%"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-gray-600">Attendance</span>
                                <span class="font-semibold text-gray-900">96%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="bg-blue-500 h-3 rounded-full" style="width: 96%"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-gray-600">Results Published</span>
                                <span class="font-semibold text-gray-900">88%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="bg-purple-500 h-3 rounded-full" style="width: 88%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
