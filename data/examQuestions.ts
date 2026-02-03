import { Question } from '../types';
import { TASK1_QUESTIONS } from './task1_questions';
import { TASK2_QUESTIONS } from './task2_questions';

// Combine all questions
export const EXAM_TOPICS: Question[] = [
    // Pre-existing manually curated questions (keep or remove as needed, keeping for variety)
    ...TASK2_QUESTIONS,
    ...TASK1_QUESTIONS,
    // Original static data content can be kept or replaced. 
    // Since user asked for "yana 25 ta" (another 25), I should essentially prepend/append these.
    // I will replace the hardcoded array with the spread of these new files + existing if useful, 
    // but the file `examQuestions.ts` was huge. I will keep the original file's structure 
    // but inject these at the top or replace the static list if it was just placeholders.
    // The previous file content had some static items. I'll include them.
    {
        id: '1',
        type: 'task2',
        category: 'Education',
        title: 'University Education',
        question: 'Some people believe that university education should be free for everyone. Others think that students should pay for their education. Discuss both views and give your opinion.',
        difficulty: 'Medium',
        tips: ['Discuss benefits of free education', 'Discuss economic burden', 'Give conclusion'],
        band9Answer: "Education is a fundamental right that should be accessible to all, regardless of financial background. Free university education ensures equal opportunity, fostering a meritocratic society where talent drives success rather than wealth. Moreover, an educated workforce boosts the economy. However, critics argue that it places an enormous tax burden on the public and may lead to a devaluation of degrees. In my opinion, while the cost is high, the long-term societal benefits of a free education system outweigh the financial downsides.",
        band7Answer: "Education is very important..."
    },
    // ==========================================
    // TASK 2: ESSAYS (Band 9 & Band 7 Variations)
    // ==========================================

    // --- EDUCATION ---
    {
        id: 't2-1',
        type: 'task2',
        category: 'Education',
        title: 'Online vs Classroom Learning',
        question: 'Online education is becoming more popular than traditional classroom learning. Do you think the advantages of this development outweigh the disadvantages?',
        difficulty: 'Medium',
        tips: ['Discuss flexibility of online learning', 'Discuss lack of social interaction', 'Conclude with your view that traditional is better for social skills'],
        band9Answer: `The rapid proliferation of digital technology has catalyzed a paradigm shift in the educational sector, with online learning platforms increasingly challenging the dominance of traditional classroom environments. While this trend offers undeniable benefits in terms of flexibility and accessibility, I contend that the disadvantages—specifically the loss of social interaction and practical engagement—ultimately outweigh the advantages for holistic student development.

The primary argument in favor of online education is its unparalleled flexibility. Students can access high-quality resources and attend lectures from prestigious institutions irrespective of their geographical location. This democratization of education allows for self-paced learning, which is particularly advantageous for working professionals or individuals with specific learning disabilities who may find rigid classroom schedules restrictive. Furthermore, it eliminates commuting time and costs, offering a more economical path to acquiring qualifications.

However, education encompasses far more than the mere accumulation of facts; it is a social process. The traditional classroom serves as a microcosm of society, where students learn vital soft skills such as teamwork, conflict resolution, public speaking, and empathy through direct face-to-face interaction. Online learning, often an isolated activity performed behind a screen, fails to cultivate these interpersonal competencies. A student may master the theoretical material online but lack the ability to articulate these ideas effectively in a group setting.

Moreover, certain disciplines require tactile, hands-on experience that digital simulations cannot fully replicate. Medical students, engineers, and artists rely on physical laboratories and studios to develop practical expertise. The absence of direct supervisor guidance and peer collaboration in these fields can lead to gaps in essential practical skills. Additionally, the lack of a structured environment at home requires a high level of self-discipline, often leading to lower completion rates and increased procrastination among younger students.

In conclusion, while online education provides a valuable, flexible alternative for information dissemination, it cannot fully replace the immersive social and practical environment of a traditional classroom. The loss of human connection and soft skill development represents a significant deficit, suggesting that a hybrid model, rather than a purely digital one, is the optimal approach for future education.`,
        band7Answer: `Nowadays, online education is becoming very popular compared to traditional classrooms. While online learning has many benefits like flexibility and low cost, I believe the disadvantages, such as lack of social interaction, are more significant.

On the one hand, learning online is very convenient. Students can study from anywhere in the world and at any time. This is perfect for people who work or live far from universities. Also, it is usually cheaper because you don't need to travel or pay for accommodation. For example, many people take courses on Coursera or Udemy to improve their skills without quitting their jobs.

On the other hand, the classroom experience is missing. In a traditional school, you meet other students and teachers face-to-face. This helps you improve your communication skills and make friends. When you learn online, you are often alone in your room, which can feel lonely. Also, it is harder to stay motivated without a teacher watching you. Many students start online courses but never finish them because they get distracted easily.

Furthermore, some subjects are hard to learn online. For example, science or engineering needs experiments in a lab. You cannot learn how to become a doctor just by watching videos; you need real practice. Traditional schools provide these facilities which are essential for learning.

In conclusion, although online education is a great tool for accessing information easily, I think it is not as good as traditional learning. The lack of social contact and practical experience are big disadvantages. Therefore, traditional schools are still the best way to get a complete education.`
    },
    {
        id: 't2-2',
        type: 'task2',
        category: 'Education',
        title: 'Gap Year Pros and Cons',
        question: 'In some countries, young people are encouraged to work or travel for a year between finishing high school and starting university studies. Discuss the advantages and disadvantages for the young people who decide to do this.',
        difficulty: 'Easy',
        tips: ['Advantage: Maturity and experience', 'Disadvantage: Loss of academic momentum', 'Balanced conclusion'],
        band9Answer: `Taking a "gap year" between high school and university has become a rite of passage for many students worldwide. This practice, involving travel or work experience, offers profound opportunities for personal growth, yet it also carries risks regarding academic continuity and financial stability.

The most significant advantage of a gap year is the development of maturity and real-world perspective. High school graduates often lack life experience, having spent their entire lives in structured educational settings. Traveling exposes them to diverse cultures, languages, and challenges, fostering independence and adaptability. Alternatively, working for a year teaches fiscal responsibility, time management, and professional etiquette. These experiences often result in students entering university with a clearer sense of purpose and higher motivation, having actively chosen their path rather than passively following the academic conveyor belt.

Conversely, there are valid concerns regarding the potential disadvantages. The primary drawback is the interruption of academic momentum. After a year of freedom and lack of intellectual rigor, some students find it difficult to readjust to the discipline of studying, attending lectures, and writing essays. This "study rust" can lead to initial struggles in their first university semesters. Furthermore, a gap year can be a financial burden. Traveling requires substantial funding, which may fall on parents, and even working might not yield significant savings if the jobs are low-skilled and low-paid. There is also the risk that the year becomes a time of leisure rather than growth, contributing little to their future resume.

In conclusion, a gap year can be a transformative experience that equips young people with essential life skills and clarity. However, its value depends entirely on how it is utilized. If structured with clear goals for travel or work, the advantages of maturity and perspective far outweigh the temporary break in academic routine.`,
        band7Answer: `It is common in many countries for students to take a gap year before university to work or travel. This trend has both positive and negative points.

The main advantage of a gap year is that students can get life experience. After finishing school, many young people do not know what they want to do. Travelling helps them see the world and become more independent. Working helps them understand the value of money and how to communicate with adults. For example, a student who works for a year might realize they love business, which helps them choose the right university course.

However, there are also disadvantages. The biggest one is that students might lose the habit of studying. After a year of fun or working, it can be hard to return to reading books and writing essays. They might find the first year of university very difficult compared to students who came straight from school. Also, travelling is expensive. If the student's parents cannot pay for it, it might not be possible.

Another problem is that some students might just waste time. If they do not have a plan, they might spend the year playing video games or doing nothing. This does not help their future and puts them a year behind their friends.

In conclusion, a gap year is a good idea if the student uses the time well to learn new things. But if they are lazy, it can be a disadvantage because they might find it hard to start studying again.`
    },

    // --- TECHNOLOGY ---
    {
        id: 't2-4',
        type: 'task2',
        category: 'Technology',
        title: 'AI and Unemployment',
        question: 'The development of artificial intelligence will eventually lead to a future where humans do not need to work. Is this a positive or a negative development?',
        difficulty: 'Hard',
        tips: ['Discuss potential leisure and creativity', 'Discuss economic inequality and loss of purpose', 'Choose the negative side'],
        band9Answer: `The prospect of Artificial Intelligence (AI) advancing to a point where human labor is rendered obsolete is a scenario that evokes both utopian and dystopian visions. While the liberation from drudgery and dangerous work is appealing, I believe that a future where humans do not need to work would be a predominantly negative development, leading to profound economic inequality and a crisis of human purpose.

Proponents of this AI-driven future argue that it would usher in a "post-work" era of leisure and creativity. Humans, freed from the necessity of earning a living, could dedicate their lives to art, philosophy, and personal relationships. This could theoretically eliminate workplace stress and allow for true self-actualization. However, this optimistic view assumes a radical redistribution of wealth that is historically unprecedented.

In reality, the displacement of human labor by AI is likely to concentrate wealth in the hands of the technology owners. Without work, the primary mechanism for income distribution collapses. Unless a robust Universal Basic Income (UBI) is implemented globally—a massive political challenge—the result would be extreme societal stratification, with a small elite controlling resources and a vast, jobless majority dependent on state handouts. This dependency could erode individual freedom and dignity.

Furthermore, work provides more than just a paycheck; it provides structure, community, and a sense of utility. For many, their profession is a core part of their identity. The psychological impact of mass unemployment could be devastating, leading to widespread aimlessness, depression, and social unrest. History shows that societies with high youth unemployment often face instability. Without the daily challenges and achievements of work, humanity might stagnate.

In conclusion, while AI will undoubtedly reduce the need for manual and repetitive labor, a future completely devoid of work carries severe risks. The potential for economic disparity and the loss of the psychological benefits of productivity suggests that we should aim for AI to augment human work, not replace it entirely.`,
        band7Answer: `There is a belief that in the future, Artificial Intelligence (AI) will do all the work and humans will not need to work. In my opinion, this is a negative development because work gives people money and a purpose in life.

Some people think not working would be great. We would have more free time to enjoy hobbies, travel, and spend time with family. It would be a stress-free life. For example, robots could do dangerous jobs like mining or boring jobs like cleaning, which would make life safer and easier for humans.

However, if nobody works, how will people get money? The companies that own the robots will become very rich, but normal people might become very poor. Unless the government gives free money to everyone, there will be a big gap between rich and poor. This could cause crime and social problems.

Also, work is important for mental health. When people work, they feel useful and proud of their achievements. If people just sit around all day with nothing to do, they might get bored and depressed. Work also helps us make friends and be part of a community. Without jobs, people might feel lonely and isolated.

In conclusion, although a life without work sounds nice, I think it would cause serious economic and social problems. It is better if AI helps us do our jobs better, rather than taking our jobs completely.`
    },

    // --- ENVIRONMENT ---
    {
        id: 't2-10',
        type: 'task2',
        category: 'Environment',
        title: 'Plastic Waste Responsibility',
        question: 'Plastic pollution is a global problem. Who should take the primary responsibility for solving this issue: the consumers, the producers, or the government?',
        difficulty: 'Hard',
        tips: ['Government sets rules', 'Producers design packaging', 'Consumers choose - discussion', 'Government is key'],
        band9Answer: `Plastic pollution has escalated into an environmental crisis, choking oceans and contaminating ecosystems. The debate over who bears the responsibility—consumers, producers, or governments—is complex. However, I am convinced that while all parties play a role, the primary responsibility lies with the government to enforce regulations and with producers to innovate sustainable alternatives, rather than placing the burden on the individual consumer.

Consumers are often blamed for their choices, but this perspective ignores the reality of the market. In many cases, consumers have no viable plastic-free alternatives for essential goods. When a supermarket wraps every vegetable in plastic, the customer is forced to participate in the pollution cycle. Relying on "consumer choice" is ineffective because biodegradable options are often expensive or hard to find. Therefore, expecting individuals to solve a systemic industrial problem through personal willpower is unrealistic and unfair.

The producers of plastic goods hold significant power. They have the capability to design packaging that is biodegradable, reusable, or recyclable. However, profit motives often drive companies to choose the cheapest option—virgin plastic—regardless of the environmental cost. Without external pressure, corporations rarely volunteer to reduce their margins for the sake of the planet.

This is where the government's role becomes the most critical. Only governments possess the authority to mandate change on a scale that matters. By implementing bans on single-use plastics, taxing non-recyclable materials, and subsidizing green alternatives, governments can force producers to innovate. The success of plastic bag levies in various countries demonstrates that legislative action produces immediate and measurable results.

In conclusion, while consumers should recycle and reduce where possible, the heavy lifting must be done by those with the power to change the system. Governments must regulate, and producers must innovate. Only through top-down structural change can we hope to stem the tide of plastic pollution.`,
        band7Answer: `Plastic pollution is a huge problem today. I believe that the government and producers are more responsible for solving this than the consumers.

Consumers can try to recycle, but it is often difficult. Everything we buy in the supermarket comes in plastic packaging. Even if a customer wants to avoid plastic, they often cannot because there are no other options. Also, recycling bins are not available everywhere. So, it is unfair to blame only the customers.

The producers are the ones who make the plastic. They choose to use plastic because it is cheap and light. If they wanted to, they could use glass, paper, or other materials. But companies care about profit, so they will not change unless they have to. They are the ones creating the waste, so they should be responsible for designing better packaging.

The government is the most important player. They can make laws to ban single-use plastics, like straws and bags. They can also force companies to pay taxes if they use too much plastic. For example, in many countries, you now have to pay for plastic bags, and this has reduced their use significantly. Only the government has the power to force companies and people to change their behavior on a large scale.

In conclusion, while everyone should help, the government and producers have the power to make the real changes needed to stop plastic pollution.`
    },

    // ==========================================
    // TASK 1: REPORTS (Band 9 & Band 7 Variations)
    // ==========================================

    // --- BAR CHARTS ---
    {
        id: 't1-1',
        type: 'task1',
        category: 'Bar Chart',
        title: 'Consumer Spending',
        question: 'The bar chart below shows the expenditure on five different categories by residents of the UK and US in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        difficulty: 'Medium',
        tips: ['Compare peaks in Housing', 'Compare discrepancies in Books/Alcohol', 'Overview of total spending'],
        band9Answer: `The bar chart compares the spending habits of residents in the United Kingdom and the United States across five distinct categories: Housing, Transport, Food, Books, and Alcohol in the year 2020.
        
Overall, it is evident that Housing was the largest expenditure for both nations, while Books accounted for the lowest share of spending. Despite these similarities, there were notable differences in potential priorities, with US residents spending more on Transport, while UK residents allocated more budget to recreational items like Books and Alcohol.

In terms of the highest expenditures, Housing consumed the largest portion of income in both countries, though the figure was slightly higher in the US at approximately 27%, compared to 24% in the UK. Transport showed a significant disparity; US residents spent nearly 20% on this category, which is markedly higher than the 12% spent by their UK counterparts, reflecting perhaps a greater reliance on private vehicles in the US.

Conversely, spending on "lifestyle" categories showed a different trend. UK residents spent proportionally more on Alcohol and Books than Americans. Specifically, UK spending on Alcohol was around 8%, double that of the US. Similarly, while spending on books was low for both, the UK figure was noticeably higher. Expenditure on Food was relatively similar, hovering around 15% for both groups.`,
        band7Answer: `The chart shows how much money people in the UK and the US spent on five things in 2020. The categories are Housing, Transport, Food, Books, and Alcohol.

Overall, Housing was the biggest expense in both countries, while Books was the smallest. The US spent more on transport, but the UK spent more on alcohol and books.

Looking at the details, Housing took up the most money. In the US, it was about 27%, which is a bit higher than the UK at 24%. Transport was also very expensive in the US, at nearly 20%, whereas in the UK it was much lower, only about 12%. Food spending was quite similar for both, around 15%.

For the smaller categories, the UK spent more. People in the UK spent about 8% on Alcohol, but in the US it was only 4%. Detailed data for Books shows that the UK also spent a little more than the US, although both were quite low compared to housing and food.

In summary, Americans spend more on living and travel, while British people spend more on leisure items.`
    },
    {
        id: 't1-6',
        type: 'task1',
        category: 'Line Graph',
        title: 'Population Growth',
        question: 'The graph shows population figures for India and China from the year 2000 predicted to 2050. Summarise the information.',
        difficulty: 'Medium',
        tips: ['Describe the crossover point around 2030', 'Describe China\'s plateau', 'Describe India\'s continuous rise'],
        band9Answer: `The line graph illustrates the population trajectories of China and India from the year 2000, with projections extending to 2050.

Overall, while China started the period with a significantly larger population, the data predicts a major demographic shift. India’s population is shown to experience a steady and rapid increase throughout the fifty-year period, whereas China’s population is projected to peak and then slowly decline, leading to India becoming the world's most populous nation.

In 2000, China’s population stood at approximately 1.25 billion, well above India’s 1.0 billion. Over the following two decades, both nations experienced growth, but India’s gradient was much steeper. The chart indicates a pivotal crossover point around the year 2030, where both nations are expected to reach roughly 1.45 billion people.

Post-2030, the trends diverge significantly. China’s population is projected to plateau and then enter a gradual decline, dropping back towards 1.4 billion by 2050. In contrast, India’s population is forecast to continue its upward surge, reaching approximately 1.6 billion by the end of the period. This represents a massive demographic expansion for India compared to China’s stabilization.`,
        band7Answer: `The graph shows the population of China and India starting from 2000 and predicting the future until 2050.

Overall, India's population is growing faster than China's. By 2030, India is expected to overtake China to become the biggest country in the world.

In the year 2000, China had more people, about 1.25 billion, while India had 1 billion. Both countries grew in the next years, but India grew faster. By 2030, both countries will have the same number of people, around 1.45 billion.

After 2030, the trends change. China's population will stop growing and start to go down a little bit, to about 1.4 billion in 2050. However, India will keep growing and will reach 1.6 billion by 2050. This means India will have many more people than China in the future.`
    },

    // --- MAPS ---
    {
        id: 't1-11',
        type: 'task1',
        category: 'Map',
        title: 'Island Development',
        question: 'The maps show an island before and after the construction of tourist facilities. Summarise the changes.',
        difficulty: 'Medium',
        tips: ['List new additions like pier and hotel', 'Mention what remained the same (East beach)', 'Describe transformation from natural to distinct'],
        band9Answer: `The two maps illustrate the transformation of a small, undeveloped island into a structured tourist resort.

Overall, the island has undergone extensive infrastructure development. While the original geographical features remains, the interior has been completely repurposed for accommodation and leisure, with only separate sections of the coastline remaining natural.

In the "Before" map, the island is completely uninhabited, featuring a beach on the western coast, some palm trees scattered centrally, and another beach to the east. It is a purely natural landscape with no man-made structures.

The "After" map displays significant construction. A pier has been built on the southern coast, allowing for boat access. This connects via a vehicle track to a central reception building. Following the track north, a large restaurant has been constructed. To the west of the reception, a series of accommodation huts have been built, connected by footpaths. A new swimming pool is located near the western beach. Notably, the eastern part of the island remains largely untouched, preserving the original eastern beach and some vegetation, likely as a quiet zone for visitors.`,
        band7Answer: `The maps show how an island changed after tourist facilities were built.

Overall, the island was empty before, but now it has many buildings for tourists like hotels and a restaurant.

In the first map, the island is natural. It has two beaches, one in the west and one in the east, and some trees. There are no buildings or roads.

In the second map, many things have been added. There is a pier on the south side for boats to arrive. A road connects the pier to a reception area in the middle of the island. Next to the reception, there is a big restaurant. To the left of the reception, they built many huts for people to sleep in. There is also a swimming pool near the western beach. The beach on the east side is still the same and has no buildings near it.`
    }
];
