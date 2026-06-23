<template>
    <div class="py-6 px-6 mx-0 mt-20 lg:mx-20">
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-3">
                <div class="flex flex-col justify-center md:justify-start md:mb-0 mb-4">
                    <h3 class="font-semibold text-3xl text-surface-900 dark:text-surface-0 mb-2">Phena SMS</h3>
                    <p class="text-surface-700 dark:text-surface-100 text-lg leading-relaxed">A school management system built to help schools simplify administration, improve visibility, and scale confidently.</p>
                </div>
            </div>

            <div class="col-span-12 md:col-span-9">
                <div class="grid grid-cols-12 gap-8 text-center md:text-left">
                    <div class="col-span-12 md:col-span-3">
                        <h4 class="font-medium text-2xl leading-normal mb-4 text-surface-900 dark:text-surface-0">Product</h4>
                        <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Admissions</a>
                        <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Fees</a>
                        <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Attendance</a>
                        <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100">Results</a>
                    </div>

                    <div class="col-span-12 md:col-span-3">
                        <h4 class="font-medium text-2xl leading-normal mb-4 text-surface-900 dark:text-surface-0">Company</h4>
                        <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">About Phena</a>


                       <Button
  label="Request Demo"
  as="a"
  href="https://calendly.com/phevab1/30min"
  target="_blank"
  rel="noopener noreferrer"
/>


                        <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100">Contact Us</a>
                    </div>

                    <div class="col-span-12 md:col-span-3">
                        <h4 class="font-medium text-2xl leading-normal mb-4 text-surface-900 dark:text-surface-0">Support</h4>
                        <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Help Centre</a>
                        <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Training</a>
                        <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100">Onboarding</a>
                    </div>

                    <div class="col-span-12 md:col-span-3">
                        <h4 class="font-medium text-2xl leading-normal mb-4 text-surface-900 dark:text-surface-0">Legal</h4>
                        <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Privacy Policy</a>
                        <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Terms of Service</a>
                        <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100">Data Protection</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="border-t border-surface-200 dark:border-surface-700 mt-10 pt-6 text-center text-surface-600 dark:text-surface-300 text-lg">© {{ new Date().getFullYear() }} Phena Systems. All rights reserved.</div>
    </div>
</template>
