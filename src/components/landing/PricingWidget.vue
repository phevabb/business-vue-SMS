<template>
    <div id="pricing" class="py-6 px-6 lg:px-20 my-2 md:my-6">
        <div class="text-center mb-6">
            <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Simple, School-Friendly Pricing</div>
            <span class="text-muted-color text-2xl">Pay based on your student population — straightforward and scalable.</span>
        </div>

        <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-8">
            <div class="col-span-12 lg:col-span-4 p-0 md:p-4">
                <div class="p-6 flex flex-col border-surface-200 dark:border-surface-600 pricing-card border-2" style="border-radius: 10px">
                    <div class="text-surface-900 dark:text-surface-0 text-center my-6 text-3xl font-semibold">Starter</div>
                    <div class="text-center text-surface-600 dark:text-surface-200 text-lg">Best for smaller schools getting started</div>

                    <div class="my-8 flex flex-col items-center gap-4">
                        <div class="flex items-end">
                            <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">₵5</span>
                            <span class="text-surface-600 dark:text-surface-200 text-lg">per student</span>
                        </div>
                        <span class="text-surface-500 text-sm text-center">Simple per-student pricing with core school management features</span>
                        <Button label="Request Demo" class="p-button-rounded border-0 font-light leading-tight bg-blue-500 text-white" />
                    </div>

                    <Divider class="w-full bg-surface-200"></Divider>

                    <ul class="my-6 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-2">
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">Student records</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">Admissions & enrolment</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">Fees & billing</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">Attendance tracking</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">Results & report cards</span></li>
                    </ul>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                <div class="p-6 flex flex-col border-primary pricing-card border-2 shadow-xl relative" style="border-radius: 10px; transform: scale(1.02); background: linear-gradient(180deg, rgba(239, 246, 255, 0.7), rgba(255, 255, 255, 1))">
                    <div class="absolute top-0 right-0 bg-primary text-white px-4 py-2 rounded-bl-xl rounded-tr-xl text-sm font-semibold">Most Popular</div>

                    <div class="text-surface-900 dark:text-surface-0 text-center my-6 text-3xl font-semibold">Standard</div>
                    <div class="text-center text-surface-600 dark:text-surface-200 text-lg">Ideal for growing schools that need more control</div>

                    <div class="my-8 flex flex-col items-center gap-4">
                        <div class="flex items-end">
                            <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">₵5</span>
                            <span class="text-surface-600 dark:text-surface-200 text-lg">per student</span>
                        </div>
                        <span class="text-surface-500 text-sm text-center">Everything in Starter plus operational support for scale</span>
                        <Button label="Get Started" class="p-button-rounded border-0 font-light leading-tight bg-blue-600 text-white" />
                    </div>

                    <Divider class="w-full bg-surface-200"></Divider>

                    <ul class="my-6 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-2">
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">All Starter features</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">Parent communication tools</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">Staff management</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">Promotion & academic history</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">Dashboard reporting</span></li>
                    </ul>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                <div class="p-6 flex flex-col border-surface-200 dark:border-surface-600 pricing-card border-2" style="border-radius: 10px">
                    <div class="text-surface-900 dark:text-surface-0 text-center my-6 text-3xl font-semibold">Enterprise</div>
                    <div class="text-center text-surface-600 dark:text-surface-200 text-lg">For multi-campus schools and larger institutions</div>

                    <div class="my-8 flex flex-col items-center gap-4">
                        <div class="flex items-end">
                            <span class="text-4xl font-bold mr-2 text-surface-900 dark:text-surface-0">Custom</span>
                        </div>
                        <span class="text-surface-500 text-sm text-center">Let’s tailor implementation, training, and deployment to your structure</span>
                        <Button label="Talk to Sales" outlined class="p-button-rounded font-light leading-tight" />
                    </div>

                    <Divider class="w-full bg-surface-200"></Divider>

                    <ul class="my-6 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-2">
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">Multi-campus setup</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">Custom workflows</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">Dedicated onboarding</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">Priority support</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl leading-normal">Custom reporting needs</span></li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="text-center mt-10 text-surface-600 dark:text-surface-200 text-lg">Need a per-term or annual billing model instead? We can customise that too.</div>
    </div>
</template>
