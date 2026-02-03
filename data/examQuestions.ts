import { Question } from '../types';

/**
 * IELTS Writing Task 2 Questions Database
 */
export const EXAM_TOPICS: Question[] = [
    {
        id: '1',
        category: 'Education',
        title: 'University Education vs Work Experience',
        question: 'Some people believe that a university education is essential for career success, while others argue that practical work experience is more valuable. Discuss both views and give your own opinion.',
        type: 'Discussion',
        difficulty: 'Medium',
        tips: [
            'Discuss advantages of university education (theoretical knowledge, networking, credentials)',
            'Discuss advantages of work experience (practical skills, industry insights, earning while learning)',
            'Give a balanced conclusion with your opinion'
        ],
        modelAnswer: `In today's competitive job market, the debate between formal university education and practical work experience remains contentious. While both pathways offer distinct advantages, I believe that an integrated approach combining elements of both is most beneficial for career success.

University education provides students with a strong theoretical foundation and critical thinking skills. Academic programs cultivate analytical abilities, research capabilities, and a comprehensive understanding of complex concepts. Moreover, universities offer valuable networking opportunities through connections with professors, industry experts, and fellow students who may become future colleagues or business partners. Many professional fields, such as medicine, law, and engineering, require formal qualifications as a basic entry requirement.

On the other hand, practical work experience offers advantages that classroom learning cannot replicate. Employees gain hands-on skills, learn to navigate workplace dynamics, and develop problem-solving abilities in real-world contexts. Work experience also allows individuals to earn an income while learning, avoiding the substantial debts often associated with higher education. Furthermore, many employers value demonstrated practical competence over academic credentials alone.

In my opinion, the most successful career path typically combines both elements. Internships, apprenticeships, and work-integrated learning programs bridge the gap between theory and practice. This hybrid approach equips individuals with both the conceptual understanding and practical skills necessary for long-term career success.

In conclusion, while university education and work experience each offer unique benefits, combining both pathways creates the most well-rounded professionals capable of excelling in today's dynamic workplace.`
    },
    {
        id: '2',
        category: 'Technology',
        title: 'Social Media Impact on Society',
        question: 'Social media has transformed the way people communicate and share information. What are the advantages and disadvantages of this development?',
        type: 'Advantages/Disadvantages',
        difficulty: 'Easy',
        tips: [
            'List clear advantages (global connectivity, information sharing, business opportunities)',
            'List clear disadvantages (privacy concerns, misinformation, mental health issues)',
            'Provide specific examples for each point'
        ],
        modelAnswer: `Social media platforms have revolutionized communication in the 21st century, fundamentally changing how humans connect and share information. This transformation brings significant benefits alongside notable concerns that merit careful consideration.

The advantages of social media are substantial and far-reaching. Firstly, these platforms enable instant global communication, allowing people to maintain relationships across vast distances and time zones. Families separated by migration can share daily moments, and businesses can coordinate operations worldwide. Secondly, social media democratizes information sharing, giving voice to ordinary citizens and enabling grassroots movements for social change. The Arab Spring demonstrations exemplified this power of digital platforms. Thirdly, entrepreneurs and small businesses benefit from cost-effective marketing channels and direct customer engagement opportunities.

However, the disadvantages demand equal attention. Privacy concerns represent a primary issue, as personal data becomes a commodity traded by corporations, often without users' full awareness or consent. Additionally, the rapid spread of misinformation poses serious threats to public health and democratic processes, as false claims can reach millions before corrections appear. Mental health research increasingly links excessive social media use, particularly among young people, to increased rates of anxiety, depression, and diminished self-esteem driven by constant social comparison.

In conclusion, while social media offers unprecedented opportunities for connection and communication, society must develop stronger mechanisms for privacy protection, information verification, and healthy usage patterns to maximize benefits while minimizing harm.`
    },
    {
        id: '3',
        category: 'Environment',
        title: 'Climate Change Responsibility',
        question: 'Some people think that governments should take primary responsibility for tackling climate change, while others believe individuals should take action. Discuss both views and give your opinion.',
        type: 'Discussion',
        difficulty: 'Medium',
        tips: [
            'Discuss government responsibilities (policy, regulations, international agreements)',
            'Discuss individual responsibilities (lifestyle choices, consumption patterns)',
            'Argue for a collaborative approach in your conclusion'
        ],
        modelAnswer: `Climate change represents one of the most pressing challenges of our time, and the question of responsibility for addressing it sparks considerable debate. While some advocate for government-led solutions, others emphasize individual action. I contend that effective climate action requires both levels of engagement working in concert.

Governments possess unique capabilities essential for addressing climate change. They can implement large-scale policies, such as carbon taxes and emissions trading schemes, that transform entire economic systems. International negotiations and agreements, like the Paris Climate Accord, require governmental participation. Furthermore, governments can invest in renewable energy infrastructure, fund climate research, and regulate industries responsible for significant emissions. Without such systematic interventions, addressing a global challenge of this magnitude proves nearly impossible.

Nevertheless, individual action remains crucial and should not be underestimated. Collective consumer choices influence market demand and corporate behavior. When millions of people adopt sustainable practices—reducing meat consumption, choosing public transportation, minimizing waste—the cumulative impact is substantial. Individual engagement also creates political pressure for governmental action, as elected officials respond to constituent concerns. Moreover, personal commitment to sustainability often spreads through social networks, creating multiplier effects.

In my view, climate change requires a synergistic approach where government policy enables and encourages individual action, while citizen engagement supports and demands effective governance. Neither level can succeed in isolation; their combined efforts create the transformational change our planet requires.

In conclusion, the false dichotomy between government and individual responsibility obscures the essential truth: addressing climate change demands coordinated action at all levels of society.`
    },
    {
        id: '4',
        category: 'Health',
        title: 'Fast Food and Public Health',
        question: 'The consumption of fast food is increasing in many countries, leading to various health problems. What are the causes of this trend, and what solutions can be implemented?',
        type: 'Problem/Solution',
        difficulty: 'Easy',
        tips: [
            'Identify 2-3 key causes (busy lifestyles, marketing, affordability)',
            'Propose practical solutions for each cause',
            'Use specific examples to support your points'
        ],
        modelAnswer: `The global surge in fast food consumption has emerged as a significant public health concern, contributing to rising rates of obesity, diabetes, and cardiovascular disease. Understanding the causes of this trend is essential for developing effective countermeasures.

Several interconnected factors drive increased fast food consumption. Modern lifestyles prioritize convenience as people work longer hours and face demanding schedules, making quick, ready-to-eat meals an attractive option. Additionally, aggressive marketing by multinational food corporations, particularly targeting children and young people, shapes dietary preferences from an early age. Economic considerations also play a role, as fast food often appears cheaper than healthy alternatives, especially in lower-income communities where access to fresh produce may be limited.

Addressing this problem requires multi-faceted solutions targeting each underlying cause. Governments should mandate clearer nutritional labeling and restrict marketing of unhealthy foods to children, following successful models implemented in countries like Chile and the United Kingdom. Educational initiatives in schools and workplaces can teach cooking skills and nutritional literacy, empowering people to make informed choices. Furthermore, subsidies for fresh fruits and vegetables, combined with strategic placement of farmers' markets in underserved areas, can improve healthy food accessibility and affordability.

Community-based programs that teach meal preparation and time-efficient cooking techniques can address the convenience factor without sacrificing nutrition. Tax incentives for employers providing healthy meal options could also shift workplace eating patterns.

In conclusion, reversing the fast food trend requires coordinated efforts addressing its root causes through education, regulation, and improved access to nutritious alternatives.`
    },
    {
        id: '5',
        category: 'Society',
        title: 'Gap Between Rich and Poor',
        question: 'In many countries, the gap between the rich and the poor is widening. Why do you think this is happening? What problems does this cause, and how can these be addressed?',
        type: 'Problem/Solution',
        difficulty: 'Hard',
        tips: [
            'Explain causes of wealth inequality (globalization, technology, policy)',
            'Discuss social and economic problems that result',
            'Propose balanced solutions from multiple perspectives'
        ],
        modelAnswer: `Economic inequality has accelerated in recent decades, with the gap between wealthy and disadvantaged populations reaching unprecedented levels in many nations. This trend stems from multiple causes and generates serious societal consequences that demand comprehensive policy responses.

The widening wealth gap results from several interrelated factors. Globalization and technological advancement have created winner-take-all dynamics, where capital owners and highly skilled workers capture disproportionate gains while traditional middle-class employment erodes. Tax policies in many countries have shifted burdens away from capital and high incomes, allowing wealth concentration to accelerate. Additionally, declining union membership has weakened workers' bargaining power, suppressing wage growth relative to productivity gains.

These disparities generate profound problems. Social mobility decreases as educational and economic opportunities become increasingly determined by birth circumstances rather than individual merit. Health outcomes diverge as lower-income populations face greater stress, poorer nutrition, and reduced healthcare access. Political stability also suffers when large segments of society feel excluded from economic prosperity, potentially fueling populist movements and social unrest.

Addressing inequality requires comprehensive strategies. Progressive tax reform, including wealth taxes and closing loopholes that benefit the wealthy, can fund public investments in education, healthcare, and infrastructure that benefit all citizens. Strengthening labor protections and minimum wage standards helps ensure workers share in economic growth. Investment in affordable education and job training programs can restore upward mobility pathways.

In conclusion, reducing inequality demands sustained commitment to policies that ensure economic prosperity is broadly shared, protecting both social cohesion and democratic institutions.`
    }
];

// Export default question for legacy compatibility
export const DEFAULT_EXAM_CONTENT = EXAM_TOPICS[0].question;
