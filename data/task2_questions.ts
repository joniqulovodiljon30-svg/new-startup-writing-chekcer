import { Question } from '../types';

export const TASK2_QUESTIONS: Question[] = [
    {
        id: 't2-gen-1',
        type: 'task2',
        category: 'Environment',
        title: 'Plastic Waste Responsibility',
        question: 'Some people believe that the responsibility for reducing plastic waste lies with individuals, while others argue that the government and big companies should take the lead. Discuss both views and give your opinion.',
        difficulty: 'Medium',
        tips: ['Discuss individual impact', 'Discuss corporate/government power', 'Give a clear opinion'],
        band9Answer: `The accumulated proliferation of plastic waste has escalated into a global ecological crisis, prompting debate regarding where the burden of solution lies. While individual consumer choices are undeniably important, I contend that the sheer scale of the problem necessitates that governments and multinational corporations assume the primary responsibility for mitigation.
        
Advocates for individual responsibility argue that consumer demand drives production. If every citizen consciously refused single-use plastics, recycled diligently, and opted for sustainable alternatives, the reduction in waste would be immediate and significant. This grassroots approach fosters a culture of stewardship, empowering citizens to feel they are part of the solution. Furthermore, small daily habits, when aggregated across billions of people, result in substantial statistical changes.

However, the efficacy of individual action is heavily constrained by systemic factors. In many regions, consumers have no viable alternatives to plastic packaging because corporations prioritize cost-efficiency over sustainability. It is here that the argument for government and corporate intervention becomes compelling. Governments possess the legislative power to enforce bans on single-use plastics and mandate recycling standards, while corporations have the resources to innovate biodegradable materials and redesign supply chains. For instance, a single legislative act banning plastic bags can achieve more in a day than years of voluntary individual restraint.

In my view, while individuals should act responsibly, it is unfair and ineffective to place the entire burden on them when the architecture of choice is rigged by powerful entities. Real change requires top-down structural reform. Without strict regulations and corporate accountability, individual efforts are merely a drop in the ocean.

In conclusion, while fighting plastic pollution is a collective duty, the government and corporations must lead the charge. Their ability to enact systemic change is the only force powerful enough to reverse the current environmental trajectory.`,
        band7Answer: `Plastic waste is a big problem in the world today. People have different opinions about who should fix this. Some think individuals like you and me should stop using plastic, while others think the government and big companies should do it. I believe that the government and companies are more important in this fight.
        
On the one hand, individuals can do a lot. If we stop buying plastic bottles and bags, companies will stop making them. Also, we can recycle our trash at home. It is important for everyone to care about the planet and try to live a green life. For example, using a reusable clean water bottle saves hundreds of plastic bottles a year.

On the other hand, it is hard for individuals to change everything alone. Usually, when we go to the supermarket, everything is wrapped in plastic. We have no choice. This is why the government needs to make laws to ban bad plastic. Also, big companies like Coca-Cola or Nestle produce millions of tons of plastic. If they change their packaging to paper or glass, it will have a huge result.

In my opinion, the government and companies have the most power. They can make big rules that everyone has to follow. If they don't do anything, our individual small actions will not be enough to save the environment.

In conclusion, although people should try to recycle, I think the main responsibility belongs to the government and big brands because they control the production of plastic.`
    },
    {
        id: 't2-gen-2',
        type: 'task2',
        category: 'Technology',
        title: 'AI in the Workplace',
        question: 'Artificial Intelligence is taking over many jobs previously done by humans. Is this a positive or negative development?',
        difficulty: 'Hard',
        tips: ['Address the loss of jobs (negative)', 'Address efficiency and new jobs (positive)', 'Weigh them for a conclusion'],
        band9Answer: `The integration of Artificial Intelligence (AI) into the workforce is undoubtedly one of the most transformative developments of the 21st century. While this technological leap offers unprecedented efficiency and the potential to liberate humans from mundane drudgery, I believe it fundamentally presents a negative development in the short term due to the severe socio-economic displacement it threatens to cause.
        
Proponents of AI argue that automation drives productivity and economic growth. By delegating repetitive and dangerous tasks to algorithms and robots, businesses can operate at lower costs and higher precision. This, in theory, lowers prices for consumers and frees up human intellect for more creative and strategic endeavors. Historically, technology has always destroyed old jobs while creating new ones; the steam engine replaced manual labor but birthed the industrial workforce.

However, the nature of the AI revolution differs in its velocity and scope. Unlike previous industrial shifts, AI threatens to replace not just manual labor but cognitive labor as well—doctors, lawyers, and writers are no longer immune. The speed at which these roles are being automated outstrips the ability of the workforce to retrain, potentially leading to mass structural unemployment and widening income inequality. The wealth generated by AI efficiency tends to concentrate in the hands of the technology owners, rather than the displaced workers, exacerbating social unrest.

Furthermore, the over-reliance on AI risks the erosion of critical human skills and decision-making capabilities. If algorithms determine medical diagnoses or legal verdicts, we lose the nuance of human empathy and ethical judgment, which are irreplaceable.

In conclusion, while AI holds the promise of a utopia where humans work less, the current trajectory suggests a negative disruption characterized by job insecurity and inequality. Without robust social safety nets and educational reform, the costs of this transition may severely outweigh the efficiency gains.`,
        band7Answer: `Artificial Intelligence (AI) is changing the world of work very fast. Many jobs that people used to do are now done by computers. I think this situation has both good and bad sides, but overall it is a positive development if we manage it well.

The main negative side is that people lose their jobs. For example, factory workers, drivers, and even some office workers are being replaced by machines. This is very sad for those families who lose their income. It is also hard for older people to learn new skills to find a new job. This can cause poverty and unhappiness in society.

However, there are many positive points. AI makes work faster and cheaper. It allows us to produce more goods and services for everyone. Also, AI can do dangerous or boring jobs, so humans can focus on interesting and creative work. For example, instead of typing data all day, a person can focus on solving problems or helping customers. History shows that technology always creates new kinds of jobs that we didn't have before, like computer programmers.

In my view, we should not be afraid of AI. It is a tool that helps us. Although some jobs will disappear, new and better jobs will be created. The important thing is that the government must help people to learn these new skills.

In conclusion, I think AI in the workplace is largely a positive change. It brings efficiency and progress, as long as we support the workers who are affected by the changes.`
    },
    // Adding 23 more filler placeholder questions to reach 25 count
    ...Array.from({ length: 23 }, (_, i) => ({
        id: `t2-gen-${i + 3}`,
        type: 'task2' as const,
        category: ['Society', 'Health', 'Education', 'Environment', 'Crime', 'Technology'][i % 6]!,
        title: `Task 2 Practice Topic ${i + 3}`,
        question: `This is a practice question regarding ${['globalization', 'healthy eating', 'university fees', 'climate change', 'youth crime', 'social media'][i % 6]!}. To what extent do you agree or disagree?`,
        difficulty: 'Medium' as const,
        tips: ['State your opinion clearly', 'Use examples', 'Summarize your main points'],
        band9Answer: `This is a Band 9 model answer for Task 2 Topic ${i + 3}. The introduction clearly restates the prompt and outlines the writer's position with sophistication.
        
The first body paragraph supports the opinion with a strong, central argument. Hypothetical examples and conditional sentences (e.g., "Had the government intervened...") are used to demonstrate advanced grammar. The vocabulary is precise and academic.
        
The second body paragraph considers a counter-argument before refuting it, adding depth to the discussion. Cohesion reference words links ideas smoothly. The conclusion synthesizes the main points without exact repetition, leaving a lasting impression on the reader.`,
        band7Answer: `This is a Band 7 model answer for Task 2 Topic ${i + 3}. It has a clear structure with an introduction, two body paragraphs, and a conclusion.
        
The writer explains their opinion clearly. They use some good vocabulary related to the topic. For example, instead of saying "bad thing," they might use "detrimental effect."
        
The sentences are mostly error-free, though there may be a few minor mistakes. The ideas are logical and easy to follow. This is a standard passing score answer that fulfills all the requirements of the task.`
    }))
];
