<svelte:head>
	<title>feelcheck — MadLibs journal worksheets</title>
</svelte:head>

<main class="landing">
	<section class="hero">
		<h1>feel<span class="accent">check</span></h1>
		<p class="tagline">Psychology-backed journal worksheets you actually want to fill in.</p>
		<p class="subtitle">MadLibs-style prompts. Personalized PDFs. Print and reflect.</p>
		<a href="/worksheets" class="cta">Browse Worksheets</a>
	</section>

	<section class="how-it-works">
		<h2>How it works</h2>
		<div class="steps">
			<div class="step">
				<span class="step-num">1</span>
				<h3>Pick a worksheet</h3>
				<p>Choose from psychology-backed templates: mood check-ins, goal-setting, decision planning, and more.</p>
			</div>
			<div class="step">
				<span class="step-num">2</span>
				<h3>Fill in the blanks</h3>
				<p>Answer fun MadLibs-style prompts. Your responses update a live preview as you type.</p>
			</div>
			<div class="step">
				<span class="step-num">3</span>
				<h3>Print and reflect</h3>
				<p>Download your personalized PDF — or grab a blank one to fill in with pen. Your choice.</p>
			</div>
		</div>
	</section>

	<section class="psychology">
		<h2>Grounded in research</h2>
		<div class="frameworks">
			<div class="framework">
				<strong>RULER</strong>
				<p>Yale emotional intelligence framework by Marc Brackett</p>
			</div>
			<div class="framework">
				<strong>CBT</strong>
				<p>Cognitive behavioral therapy self-monitoring techniques</p>
			</div>
			<div class="framework">
				<strong>OKRs</strong>
				<p>Objectives & Key Results from Intel and Google</p>
			</div>
			<div class="framework">
				<strong>Progress Principle</strong>
				<p>Small wins as motivation from Teresa Amabile (Harvard)</p>
			</div>
		</div>
	</section>
</main>

<style>
	.landing {
		max-width: 800px;
		margin: 0 auto;
		padding: var(--space-lg);
	}

	.hero {
		text-align: center;
		padding: var(--space-2xl) 0;
	}

	h1 {
		font-size: 3.5rem;
		letter-spacing: -0.02em;
		margin-bottom: var(--space-md);
	}

	.accent {
		color: var(--color-accent);
	}

	.tagline {
		font-size: 1.25rem;
		color: var(--color-caption);
		margin-bottom: var(--space-sm);
	}

	.subtitle {
		color: var(--color-divider);
		margin-bottom: var(--space-xl);
	}

	.cta {
		display: inline-block;
		padding: var(--space-sm) var(--space-lg);
		background: var(--color-text);
		color: var(--color-white);
		border-radius: var(--corner-r);
		font-weight: 600;
		font-size: 1rem;
		transition: opacity 0.15s;
	}

	.cta:hover {
		opacity: 0.85;
		text-decoration: none;
	}

	/* How it works */
	.how-it-works {
		padding: var(--space-2xl) 0;
		border-top: 1px solid var(--color-grid);
	}

	.how-it-works h2 {
		text-align: center;
		margin-bottom: var(--space-xl);
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
	}

	@media (max-width: 640px) {
		.steps {
			grid-template-columns: 1fr;
		}
	}

	.step {
		text-align: center;
	}

	.step-num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--color-accent);
		color: var(--color-white);
		font-weight: 700;
		font-size: 1rem;
		margin-bottom: var(--space-sm);
	}

	.step h3 {
		font-size: 1rem;
		margin-bottom: var(--space-xs);
	}

	.step p {
		font-size: 0.875rem;
		color: var(--color-caption);
	}

	/* Psychology */
	.psychology {
		padding: var(--space-2xl) 0;
		border-top: 1px solid var(--color-grid);
	}

	.psychology h2 {
		text-align: center;
		margin-bottom: var(--space-xl);
	}

	.frameworks {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-md);
	}

	@media (max-width: 640px) {
		.frameworks {
			grid-template-columns: 1fr;
		}
	}

	.framework {
		padding: var(--space-md);
		background: var(--color-white);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
	}

	.framework strong {
		color: var(--color-accent);
		font-size: 0.875rem;
	}

	.framework p {
		font-size: 0.8125rem;
		color: var(--color-caption);
		margin-top: var(--space-xs);
	}
</style>
