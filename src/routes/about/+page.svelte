<script lang="ts">
	import { AccordionItem, Accordion } from 'flowbite-svelte';
</script>

<div class="px-4">
	
	<!-- About -->
	<div class="py-5">
		<h2 class="text-xl font-bold">About</h2>

		<div class="p-5">
			<p>
				I am passionate about learning languages and I believe that the more languages you speak,
				the wider your world becomes, the more you can experience and learn. That is why I always
				asked myself things like:
			</p>
			<br />
			<ul class="list-[circle] px-10">
				<li>In which countries could I communicate with ease?</li>
				<li>How many people could I interact with?</li>
			</ul>
			<br />
			<p>The Language Map is my way of answering these questions by visualizing your linguistic reach and putting it into perspective.</p>
		</div>
	</div>

	<!-- FAQs -->
	<div class="py-5">
		<h2 class="text-xl font-bold">FAQs</h2>

		<Accordion class="p-5">
			<AccordionItem>
				<span slot="header">General Considerations</span>

				<div>
					<p>
						The Language Map is not aimed to be ultra-precise, but rather a simple and entertaining
						reference. As such, the numbers presented are estimates based on multiple free online
						data sources.
					</p>

					<br />
					<p>Additional considerations include:</p>
					<br />
					<ul class="list-[circle] px-10">
						<li>
							The languages of a country are primarily the official ones. However, in some cases
							they also include widely spoken, de facto languages, and lingua francas used by a
							significant part of the population.
						</li>

						<li>
							In certain cases, it was not possible to determine a clear percentage of speakers, and
							values had to be determined based on rough estimates or interpretations of the
							available sources.
						</li>
					</ul>
				</div>
			</AccordionItem>
			<AccordionItem>
				<span slot="header">Statistics Data Sources</span>

				<div>
					<ul class="list-[circle] px-10">
						<li>
							General country data: <a
								class="font-semibold text-sky-500"
								href="https://restcountries.com"
								target="_blank">restcountries.com</a
							>
						</li>

						<li>
							Flags by <a
								class="font-semibold text-sky-500"
								href="https://github.com/googlefonts/noto-emoji"
								target="_blank">Noto-Emoji</a
							>
						</li>

						<li>
							Language data compiled from:
							<ul class="list-disc px-5">
								<li>
									<a
										class="font-semibold text-sky-500"
										href="https://www.cia.gov/the-world-factbook/field/languages/"
										target="_blank">CIA World Factbook</a
									>
								</li>
								<li>
									<a
										class="font-semibold text-sky-500"
										href="https://www.worldatlas.com/"
										target="_blank">World Atlas</a
									>
								</li>
								<li>
									<a
										class="font-semibold text-sky-500"
										href="https://culturalatlas.sbs.com.au"
										target="_blank">Cultural Atlas</a
									>
								</li>
								<li>
									<a
										class="font-semibold text-sky-500"
										href="https://www.statista.com"
										target="_blank">Statista</a
									>
								</li>
								<li>
									<a
										class="font-semibold text-sky-500"
										href="https://translatorswithoutborders.org"
										target="_blank">Translators Without Borders</a
									>
								</li>
								<li>
									Wikipedia Country Pages. Ex: <a
										class="font-semibold text-sky-500"
										href="https://en.wikipedia.org/wiki/Languages_of_Fiji"
										target="_blank">Fiji</a
									>
								</li>
								<li>
									Wikipedia Language Pages. Ex: <a
										class="font-semibold text-sky-500"
										href="https://en.wikipedia.org/wiki/Geographical_distribution_of_French_speakers"
										target="_blank">French Language</a
									>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</AccordionItem>
			<AccordionItem>
				<span slot="header">Map Data Sources</span>
				<p class="mb-2 text-gray-500 dark:text-gray-400">
					Language Map sources its map data from the <a
						class="font-semibold text-sky-500"
						href="https://www.npmjs.com/package/world-atlas"
						target="_blank">World Atlas TopoJSON</a
					>
					and renders it according to the list of
					<a
						class="font-semibold text-sky-500"
						href="https://www.un.org/en/about-us/member-states"
						target="_blank">UN Member States</a
					> (as of December 2023).
				</p>
			</AccordionItem>
		</Accordion>
	</div>

	<!-- Supporters  -->
	<div class="py-5">
		<h2 class="text-xl font-bold">Supporters</h2>

		<div class="p-5">
			<p>
				Here are some people that supported this small project with feedback, tests, ideas, or tools. Thank you.
			</p>
			<br />
			<ul class="list-[circle] px-10">
				<li>
					<a
						class="font-semibold text-sky-500"
						href="https://adhs-beratung.online"
						target="_blank">Melanie Schroeder</a
					>
				</li>
				<li>
					<a
						class="font-semibold text-sky-500"
						href="https://github.com/alejodiazg"
						target="_blank">Alejandro Diaz</a
					>
				</li>
				<li>
					<a
						class="font-semibold text-sky-500"
						href="https://www.patreon.com/amatos"
						target="_blank">Alejandro Matos</a
					>
				</li>
			</ul>
			<br />
		</div>
	</div>
</div>

<style>
</style>
