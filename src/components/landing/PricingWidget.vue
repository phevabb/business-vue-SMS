<template>
    <div id="pricing" class="py-6 px-6 lg:px-20 my-2 md:my-6">

        <!-- HEADER -->
        <div class="text-center mb-6">
            <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">
                Simple, School-Friendly Pricing
            </div>
            <span class="text-muted-color text-2xl">
                Pay based on your student population — straightforward and scalable.
            </span>
        </div>

        <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-8">

            <!-- FREE TRIAL -->
            <div class="col-span-12 lg:col-span-4 p-0 md:p-4">
                <div class="p-6 flex flex-col border-surface-200 dark:border-surface-600 pricing-card border-2 border-blue-500 shadow-lg" style="border-radius: 12px">

                    <div class="text-center my-4 text-3xl font-semibold">
                        Free Trial
                    </div>

                    <div class="text-center text-lg">
                        Try PhenaSMS RISK-FREE for one full school term
                    </div>

                    <div class="my-8 flex flex-col items-center gap-3">
                        <div class="flex items-end">
                            <span class="text-5xl font-bold mr-2">₵0</span>
                            <span class="text-lg">for 1 term</span>
                        </div>

                        <span class="text-green-600 font-semibold text-sm text-center">
                            No payment required • Cancel anytime
                        </span>

                        <!-- IMPORTANT CLARITY -->
                        <span class="text-xs text-gray-500 text-center">
                            Full access for 1 term • Continue at ₵5/student after trial
                        </span>

                        <Button
                            label="Start Free Trial"
                            as="router-link"
                            to="/auth/register"
                            class="p-button-rounded border-0 font-medium leading-tight bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 shadow-md"
                        />
                    </div>

                    <Divider class="w-full"></Divider>

                    <ul class="my-6 list-none p-0 flex flex-col px-2">
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-green-500 mr-2"></i>
                            <span class="text-xl">All features included (full access)</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-green-500 mr-2"></i>
                            <span class="text-xl">Student records</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-green-500 mr-2"></i>
                            <span class="text-xl">Admissions & enrolment</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-green-500 mr-2"></i>
                            <span class="text-xl">Fees & billing</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-green-500 mr-2"></i>
                            <span class="text-xl">Results & report cards</span>
                        </li>
                    </ul>

                </div>
            </div>

            <!-- STANDARD -->
            <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                <div class="p-6 flex flex-col border-primary pricing-card border-2 shadow-xl relative"
                     style="border-radius: 10px; transform: scale(1.02); background: linear-gradient(180deg, rgba(239, 246, 255, 0.7), rgba(255, 255, 255, 1))">

                    <div class="absolute top-0 right-0 bg-primary text-white px-4 py-2 rounded-bl-xl rounded-tr-xl text-sm font-semibold">
                        Most Popular
                    </div>

                    <div class="text-center my-6 text-3xl font-semibold">Standard</div>

                    <div class="text-center text-lg">
                        Ideal for growing schools that need more control
                    </div>

                    <div class="my-8 flex flex-col items-center gap-4">
                        <div class="flex items-end">
                            <span class="text-5xl font-bold mr-2">₵5</span>
                            <span class="text-lg">per student</span>
                        </div>

                        <span class="text-sm text-center">
                            Everything in Free Trial plus ongoing access & support
                        </span>

                        <Button
                            label="Get Started"
                            text
                            as="router-link"
                            to="/auth/register"
                            class="p-button-rounded border-0 font-light leading-tight bg-blue-600 text-white"
                        />
                    </div>

                    <Divider class="w-full"></Divider>

                    <ul class="my-6 list-none p-0 flex flex-col px-2">
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl">All features included</span></li>

                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl">Staff management</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl">Promotion & academic history</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl">Dashboard reporting</span></li>
                    </ul>

                </div>
            </div>

            <!-- ENTERPRISE -->
            <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                <div class="p-6 flex flex-col border-surface-200 dark:border-surface-600 pricing-card border-2" style="border-radius: 10px">

                    <div class="text-center my-6 text-3xl font-semibold">Enterprise</div>

                    <div class="text-center text-lg">
                        For multi-campus schools and larger institutions
                    </div>

                    <div class="my-8 flex flex-col items-center gap-4">
                        <div class="flex items-end">
                            <span class="text-4xl font-bold mr-2">Custom</span>
                        </div>

                        <span class="text-sm text-center">
                            Tailored implementation, training, and deployment
                        </span>

                       <Button
    label="Talk to Sales"
    outlined
    class="p-button-rounded font-light leading-tight"
    as="a"
    href="mailto:support@phenaschool.com?subject=Sales%20Inquiry"
/>
                    </div>

                    <Divider class="w-full"></Divider>

                    <ul class="my-6 list-none p-0 flex flex-col px-2">
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl">Multi-campus setup</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl">Custom workflows</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl">Dedicated onboarding</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl">Priority support</span></li>
                        <li class="py-2"><i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i><span class="text-xl">Custom reporting</span></li>
                    </ul>

                </div>
            </div>

        </div>

        <!-- FOOTNOTE
        <div class="text-center mt-10 text-lg">
            Need a per-term or annual billing model instead? We can customise that too.
        </div> -->

    </div>
</template>
