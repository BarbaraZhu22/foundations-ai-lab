export type Blank = {
  id: string;
  label: string;
  accept: string[];
  marks: number;
  show?: string;
};

export type Option = { id: string; text: string };

export type Block = {
  id: string;
  title: string;
  prompt: string;
  explanation: string;
  blanks?: Blank[];
  options?: Option[];
  correctOption?: string;
  optionMarks?: number;
  columns?: number;
};

export type Card = {
  id: string;
  kicker: string;
  title: string;
  intro?: string;
  blocks: Block[];
};

const choice = (
  card: Omit<Card, "blocks"> & {
    prompt: string;
    explanation: string;
    options: Option[];
    correctOption: string;
  },
): Card => ({
  id: card.id,
  kicker: card.kicker,
  title: card.title,
  blocks: [
    {
      id: card.id,
      title: card.title,
      prompt: card.prompt,
      explanation: card.explanation,
      options: card.options,
      correctOption: card.correctOption,
      optionMarks: 2,
    },
  ],
});

export const fillCards: Card[] = [
  {
    id: "q1",
    kicker: "填空 · 2 分",
    title: "没有输入的回归",
    blocks: [
      {
        id: "q1",
        title: "最小平方误差的常数",
        prompt:
          "用最小二乘拟合一个常数 c，模型没有输入。训练标签是 2, 4, 6, 8, 10。使平方误差最小的 c 是多少？",
        explanation:
          "没有特征时，最优常数就是标签的平均值。(2+4+6+8+10)/5 = 6。这是正规方程在“只有一列全是 1”时的特例。",
        blanks: [{ id: "c", label: "c =", accept: ["6"], marks: 2 }],
      },
    ],
  },
  {
    id: "q5",
    kicker: "填空 · 2 分",
    title: "Softmax 数值",
    blocks: [
      {
        id: "q5",
        title: "三个 logit",
        prompt:
          "三分类的 logits 是 (1, 1, 0)。softmax 概率保留三位有效数字。e¹ ≈ 2.718，分母是 2.718 + 2.718 + 1。",
        explanation:
          "先取指数再归一化。e¹ / (2e¹ + 1) ≈ 0.422，e⁰ 那一项 ≈ 0.155。两项一样大，是因为两个 logit 都是 1。",
        blanks: [
          { id: "p1", label: "第 1 类", accept: ["0.422", "0.42"], marks: 2 / 3, show: "0.422" },
          { id: "p2", label: "第 2 类", accept: ["0.422", "0.42"], marks: 2 / 3, show: "0.422" },
          { id: "p3", label: "第 3 类", accept: ["0.155", "0.16", "0.15"], marks: 2 / 3, show: "0.155" },
        ],
      },
    ],
  },
  {
    id: "q7",
    kicker: "填空 · 2 分",
    title: "二元交叉熵",
    blocks: [
      {
        id: "q7",
        title: "p = 0.9",
        prompt:
          "预测正类概率 p = 0.9。分别计算真实标签为正、为负时的交叉熵，保留三位小数。L = −y ln p − (1−y) ln(1−p)。",
        explanation:
          "标签为正时只剩 −ln 0.9 ≈ 0.105。标签为负时只剩 −ln 0.1 ≈ 2.303。自信地猜错，损失会大很多。",
        blanks: [
          { id: "pos", label: "正标签", accept: ["0.105", "0.11"], marks: 1, show: "0.105" },
          { id: "neg", label: "负标签", accept: ["2.303", "2.30", "2.3"], marks: 1, show: "2.303" },
        ],
      },
    ],
  },
  {
    id: "q10",
    kicker: "填空 · 2 分",
    title: "仿射层有多少参数",
    blocks: [
      {
        id: "q10",
        title: "50 进 10 出",
        prompt: "a = xW + b。x 有 50 维，输出 10 个数，偏置也要算进去。可训练参数一共多少？",
        explanation: "权重是 50×10 = 500，每个输出还有一个偏置，再加 10，一共 510。",
        blanks: [{ id: "n", label: "参数个数", accept: ["510"], marks: 2 }],
      },
    ],
  },
  {
    id: "q12",
    kicker: "填空 · 2 分",
    title: "ReLU 的折点",
    blocks: [
      {
        id: "q12",
        title: "a(x) = 2x − 1",
        prompt:
          "神经元的预激活是 a(x) = 2x − 1，激活用 ReLU。x 小于折点时输出 0，大于等于折点时输出 2x−1。折点在哪里？",
        explanation:
          "ReLU 在预激活为 0 的地方转折。2x−1 = 0 得到 x = 1/2。左边是贴着 0 的水平线，右边是斜率 2 的直线。",
        blanks: [
          { id: "left", label: "x <", accept: ["0.5", "1/2", "0.50"], marks: 1, show: "1/2" },
          { id: "right", label: "x ≥", accept: ["0.5", "1/2", "0.50"], marks: 1, show: "1/2" },
        ],
      },
    ],
  },
  {
    id: "q13",
    kicker: "填空 · 2 分",
    title: "一个 epoch 更新几次",
    blocks: [
      {
        id: "q13",
        title: "10000 个样本，batch 100",
        prompt: "一个 epoch 是把训练集完整过一遍。10000 个样本、minibatch 大小 100，这一遍里参数更新多少次？",
        explanation: "每个 batch 更新一次。10000 / 100 = 100 次。",
        blanks: [{ id: "n", label: "更新次数", accept: ["100"], marks: 2 }],
      },
    ],
  },
  {
    id: "q19",
    kicker: "填空 · 2 分",
    title: "卷积和池化之后的边长",
    blocks: [
      {
        id: "q19",
        title: "64×64 的图",
        prompt:
          "64×64 的图像，先做 3×3 卷积，stride 1，每边 padding 1，再做 2×2 最大池化。两步之后的边长分别是多少？",
        explanation:
          "输出边长 = (输入 + 2×padding − kernel) / stride + 1。(64+2−3)/1+1 = 64，padding 刚好补上核的缩小。2×2 池化把边长减半，变成 32。",
        blanks: [
          { id: "conv", label: "卷积后边长", accept: ["64"], marks: 1 },
          { id: "pool", label: "池化后边长", accept: ["32"], marks: 1 },
        ],
      },
    ],
  },
  {
    id: "q20",
    kicker: "填空 · 2 分",
    title: "卷积层参数量",
    blocks: [
      {
        id: "q20",
        title: "8 进 32 出，5×5",
        prompt: "卷积层有 8 个输入通道、32 个输出通道、5×5 的核，偏置也算。可训练参数一共多少？",
        explanation: "32 × 8 × 5 × 5 = 6400 个权重，每个输出通道再加 1 个偏置，一共 6432。",
        blanks: [{ id: "n", label: "参数个数", accept: ["6432"], marks: 2 }],
      },
    ],
  },
];

export const choiceCards: Card[] = [
  choice({
    id: "q2",
    kicker: "选择 · 2 分",
    title: "学习率太大或太小",
    prompt: "梯度下降 θ ← θ − η∇L。η 太小和太大会怎样？",
    explanation:
      "太小：每一步几乎不动，要很多轮才有进展。太大：一步跨过最低点，损失来回跳，甚至发散。",
    correctOption: "a",
    options: [
      { id: "a", text: "太小则每步极小、收敛很慢；太大则越过最低点，损失震荡或发散" },
      { id: "b", text: "太小会发散；太大只是变慢，最后仍会到同一个点" },
      { id: "c", text: "学习率只改变最终精度，不影响收敛过程" },
      { id: "d", text: "学习率决定的是 batch 里有多少样本" },
    ],
  }),
  choice({
    id: "q3",
    kicker: "选择 · 2 分",
    title: "弯曲的曲线，线性的参数",
    prompt: "y = a + b sin x + c cos x 对 x 不是直线。怎样仍用线性回归来拟合？",
    explanation:
      "对参数 (a, b, c) 它是线性的。特征做成 (1, sin x, cos x)，正规方程和梯度下降都照旧用。",
    correctOption: "a",
    options: [
      { id: "a", text: "特征用 (1, sin x, cos x)，模型对参数是线性的" },
      { id: "b", text: "把 sin x 和 cos x 加成为一个特征就行" },
      { id: "c", text: "只要式子里有 sin，就必须换神经网络" },
      { id: "d", text: "先对 x 取对数，再做普通直线拟合" },
    ],
  }),
  choice({
    id: "q4",
    kicker: "选择 · 2 分",
    title: "Softmax 在做什么",
    prompt: "Softmax 是什么？",
    explanation:
      "softmax(a)ᵢ = eᵃⁱ / Σⱼ eᵃʲ。指数保证为正，除以总和保证加起来等于 1。最大的 logit 得到最大的概率。",
    correctOption: "a",
    options: [
      { id: "a", text: "把一组实数变成正的、和为 1 的概率，最大的输入得到最大概率" },
      { id: "b", text: "把每个数除以这组数里的最大值，所以一定有一个概率是 1" },
      { id: "c", text: "专门把回归标签压到 −1 和 1 之间" },
      { id: "d", text: "输出可以是负数，只要平均值是 1" },
    ],
  }),
  choice({
    id: "q6",
    kicker: "选择 · 2 分",
    title: "为什么要过 sigmoid",
    prompt: "二分类网络在算损失之前，为什么要把输出送进 sigmoid？",
    explanation:
      "最后一层可以吐出任意实数，交叉熵要的是概率。sigmoid 把实数轴压进 (0, 1)，这个数就是 P(y=1 | x)。",
    correctOption: "a",
    options: [
      { id: "a", text: "输出是任意实数，损失要概率；sigmoid 把实数压到 (0, 1)" },
      { id: "b", text: "为了把输出变成整数类别编号" },
      { id: "c", text: "为了让这一层不必再学习权重" },
      { id: "d", text: "因为交叉熵只能接收负数" },
    ],
  }),
  choice({
    id: "q8",
    kicker: "选择 · 2 分",
    title: "深度多出来的是什么",
    prompt: "更深的网络对复杂数据多提供了什么？",
    explanation:
      "每一层都在下一层的特征上再提特征，表示一层比一层更抽象。复杂函数因此不必靠单层堆很多单元。",
    correctOption: "a",
    options: [
      { id: "a", text: "逐层组合出更抽象的特征，比单层做得很宽更省单元" },
      { id: "b", text: "只是把参数变多，表达能力和一层一样" },
      { id: "c", text: "保证训练损失一定会降到 0" },
      { id: "d", text: "用来代替训练数据" },
    ],
  }),
  choice({
    id: "q9",
    kicker: "选择 · 2 分",
    title: "Sigmoid 长什么样",
    prompt: "σ(x) = 1 / (1 + e⁻ˣ) 的图像是哪一种？",
    explanation: "S 形。左边趋向 0，右边趋向 1，正好穿过 (0, 1/2)。σ(0) = 1/2。",
    correctOption: "a",
    options: [
      { id: "a", text: "S 形，从 0 升到 1，经过 (0, 1/2)" },
      { id: "b", text: "S 形，从 −1 升到 1，经过 (0, 0)" },
      { id: "c", text: "在 0 处断开的折线，左边是 0，右边是 x" },
      { id: "d", text: "从 0 升到 1，但经过原点 (0, 0)" },
    ],
  }),
  choice({
    id: "q11",
    kicker: "选择 · 2 分",
    title: "两层线性叠在一起",
    prompt: "y = x W₁ W₂，中间没有非线性，偏置为 0。它为什么并不比一层线性更强？",
    explanation: "两个矩阵的乘积还是一个矩阵 W = W₁W₂，所以 y = xW 仍是线性映射。深度要靠 ReLU 这类非线性才有用。",
    correctOption: "a",
    options: [
      { id: "a", text: "W₁W₂ 本身就是一个矩阵，整体仍是一次线性映射" },
      { id: "b", text: "矩阵相乘会变出 x 的平方项" },
      { id: "c", text: "只要有两层，中间即使没有激活也已经是非线性" },
      { id: "d", text: "没有偏置时网络完全不能拟合任何数据" },
    ],
  }),
  choice({
    id: "q14",
    kicker: "选择 · 2 分",
    title: "欠拟合长什么样",
    prompt: "什么是欠拟合？训练损失和验证损失会是什么关系？",
    explanation: "模型不够灵活，或还没练够，抓不住数据里的结构。两条损失都高，而且彼此接近。",
    correctOption: "a",
    options: [
      { id: "a", text: "模型没能抓住数据结构；训练和验证损失都高，而且接近" },
      { id: "b", text: "训练损失很低，验证损失很高" },
      { id: "c", text: "只有验证损失高，训练损失一定接近 0" },
      { id: "d", text: "损失会变成负数" },
    ],
  }),
  choice({
    id: "q15",
    kicker: "选择 · 2 分",
    title: "自编码器",
    prompt: "自编码器是什么，为什么中间要更窄？",
    explanation:
      "它被训练来把输入原样重建出来。输入必须挤过更窄的隐层，这一层就得学会压缩表示，之后可以用来压缩、去噪或当作特征。",
    correctOption: "a",
    options: [
      { id: "a", text: "重建自己的输入；窄的隐层逼它学会压缩表示" },
      { id: "b", text: "用标签做监督分类的网络" },
      { id: "c", text: "专门计算 softmax 的一层" },
      { id: "d", text: "输出维度必须比输入更大" },
    ],
  }),
  choice({
    id: "q16",
    kicker: "选择 · 2 分",
    title: "VAE 和普通自编码器",
    prompt: "变分自编码器与普通自编码器的差别是什么？",
    explanation:
      "编码器输出的是分布的均值和方差，送给解码器的 z 是抽出来的。损失里还有一项把这个分布拉向先验，生成时才能从先验里抽样。",
    correctOption: "a",
    options: [
      { id: "a", text: "编码器给出均值和方差并抽样，损失里还有把分布拉向先验的一项" },
      { id: "b", text: "只是把瓶颈做得更窄一些" },
      { id: "c", text: "去掉解码器，只保留编码器" },
      { id: "d", text: "隐变量必须是离散类别" },
    ],
  }),
  choice({
    id: "q17",
    kicker: "选择 · 2 分",
    title: "从 VAE 里生成一个新样本",
    prompt: "训练好的变分自编码器怎样生成一个新的 x？",
    explanation: "从先验抽 z，通常是 N(0, I)，再送进解码器得到 x。生成时不再经过编码器。",
    correctOption: "a",
    options: [
      { id: "a", text: "从先验 p(z)（通常 N(0, I)）抽 z，再过解码器" },
      { id: "b", text: "在训练集里找一张最像的图原样输出" },
      { id: "c", text: "把编码器在训练样本上的 μ 直接当成像素" },
      { id: "d", text: "对训练集标签做 softmax" },
    ],
  }),
  choice({
    id: "q18",
    kicker: "选择 · 2 分",
    title: "稀疏自编码器的 L1",
    prompt:
      "损失是 ‖x − W_d h‖² + λ‖h‖₁，h = ReLU(W_e x + b)，隐藏层比输入宽很多。λ‖h‖₁ 在鼓励什么，隐藏层为什么要这么宽？",
    explanation:
      "L1 把大多数隐藏单元压到正好为 0，每个输入只用少数几个特征来解释。做得很宽，是为了有一本大词典：很多可以单独解释的特征，每个都很少被用到。",
    correctOption: "a",
    options: [
      { id: "a", text: "让大多数单元正好为 0；做宽是为了容纳很多很少被用到的特征" },
      { id: "b", text: "让所有隐藏单元都强烈激活" },
      { id: "c", text: "故意把重建误差变大，防止记住输入" },
      { id: "d", text: "宽隐藏层是为了减少能表示的特征种类" },
    ],
  }),
  choice({
    id: "q21",
    kicker: "选择 · 2 分",
    title: "卷积为什么参数少",
    prompt: "同一张图上，卷积层的参数为什么比全连接层少很多？",
    explanation: "同一个小核在每个位置重复使用，权重是共享的。每个输出也只看一小块局部像素，而不是整张图。",
    correctOption: "a",
    options: [
      { id: "a", text: "小核在所有位置共享权重，每个输出只看局部小块" },
      { id: "b", text: "卷积把整张图压成一个数，所以没有权重" },
      { id: "c", text: "因为 padding 把参数消掉了" },
      { id: "d", text: "卷积层不学习，核是固定的" },
    ],
  }),
  choice({
    id: "q22",
    kicker: "选择 · 2 分",
    title: "Query、Key、Value",
    prompt: "注意力里每个 token 都会产生 query、key、value。三者分别是什么角色？",
    explanation:
      "Query 是“我在找什么”。Key 是“我自己是什么”，用来和 query 比较。Value 是比较完之后真正被取出来、按权重混合的内容。",
    correctOption: "a",
    options: [
      { id: "a", text: "Query 在找什么；Key 用来比较；Value 是被混合的内容" },
      { id: "b", text: "三者都是损失对参数的梯度，只是名字不同" },
      { id: "c", text: "Query 是标签，Key 是学习率，Value 是 batch 大小" },
      { id: "d", text: "只有 Value 参与运算，Query 和 Key 不进入分数" },
    ],
  }),
  choice({
    id: "q23",
    kicker: "选择 · 2 分",
    title: "Self-attention 和 cross-attention",
    prompt: "自注意力和交叉注意力差在哪里？",
    explanation: "自注意力的 Q、K、V 来自同一条序列。交叉注意力的 Q 来自一条序列，K 和 V 来自另一条，比如解码器去看编码器的输出。",
    correctOption: "a",
    options: [
      { id: "a", text: "Self：Q、K、V 同一条序列；Cross：Q 来自一条，K 和 V 来自另一条" },
      { id: "b", text: "Cross-attention 就是加了因果 mask 的 self-attention" },
      { id: "c", text: "Self-attention 不能用在文本上" },
      { id: "d", text: "两者计算完全相同，只是层的名字不同" },
    ],
  }),
  choice({
    id: "q24",
    kicker: "选择 · 2 分",
    title: "因果 mask",
    prompt: "因果 mask 是什么？预测下一个 token 时为什么需要它？",
    explanation:
      "把位置 i 对 j > i 的分数改成 −∞，softmax 之后权重是 0。不然训练时位置 i 可以直接看见下一个 token，预测就变得没有意义，生成时也复现不了。",
    correctOption: "a",
    options: [
      { id: "a", text: "遮住未来位置（j > i），否则训练时能直接看到下一个 token" },
      { id: "b", text: "遮住对角线，让每个 token 不能看自己" },
      { id: "c", text: "随机丢掉一半注意力权重，用来正则" },
      { id: "d", text: "只在生成时使用，训练时不需要" },
    ],
  }),
  choice({
    id: "q25",
    kicker: "选择 · 2 分",
    title: "为什么要多头",
    prompt: "多头注意力是什么，为什么不只用一个头？",
    explanation:
      "几套不同的 W_Q、W_K、W_V 并行做注意力，输出拼起来再乘一个矩阵。一个头只能做一次加权平均；多个头可以同时盯不同的关系。",
    correctOption: "a",
    options: [
      { id: "a", text: "多套 QKV 并行，输出拼接再投影；不同头可以同时注意不同关系" },
      { id: "b", text: "把同一条序列复制几份，用来提高数值精度" },
      { id: "c", text: "给每个头配一个单独的损失函数" },
      { id: "d", text: "头的数量必须等于词表大小" },
    ],
  }),
];

const q1Intro = `网络是 a₁ = x W₁，φ₁ = ReLU(a₁)，f = φ₁ W₂，L = (f − y)²。偏置都是 0。

x = (2, 1)
W₁ = [[1, −1], [−1, 1]]
W₂ = (2, 1)
y = 1

x 是行向量。a₁ 的第一个分量是 2·1 + 1·(−1)。`;

const q2Intro = `三个 token 的向量：x₁ = (1, 1)，x₂ = (1, 0)，x₃ = (0, 1)。
W_Q = W_K = W_V = I，所以 q、k、v 就是 x 自己。忽略 1/√d。
分数 Sᵢⱼ = xᵢ · xⱼ。`;

const q3Intro = `VAE 最大化

L = E_q [ln p(x | z)] − KL(q(z | x) ‖ p(z))

一维高斯对标准正态的 KL 是 ½(μ² + σ² − 1 − ln σ²)。`;

const backprop: Card["blocks"] = [
  {
    id: "q1a",
    title: "(a) 前向",
    prompt: "算出 a₁ 的两个分量、ReLU 之后的 φ₁、标量 f 和损失 L。",
    explanation: "a₁ = (1, −1)。ReLU 把负数掐成 0，所以 φ₁ = (1, 0)。f = 1·2 + 0·1 = 2。L = (2−1)² = 1。",
    blanks: [
      { id: "a0", label: "a₁ 第一分量", accept: ["1"], marks: 0.5 },
      { id: "a1", label: "a₁ 第二分量", accept: ["-1"], marks: 0.5 },
      { id: "p0", label: "φ₁ 第一分量", accept: ["1"], marks: 0.5 },
      { id: "p1", label: "φ₁ 第二分量", accept: ["0"], marks: 0.5 },
      { id: "f", label: "f", accept: ["2"], marks: 0.5 },
      { id: "L", label: "L", accept: ["1"], marks: 0.5 },
    ],
  },
  {
    id: "q1b",
    title: "(b) 对 W₂ 的梯度",
    prompt: "∂L/∂f = 2(f − y)。再求 ∂L/∂W₂ 的两个分量。f 通过 φ₁,ᵢ W₂,ᵢ 依赖每一个权重。",
    explanation: "∂L/∂f = 2(2−1) = 2。每个权重的梯度是这个数乘上对应的 φ。φ = (1, 0)，所以 ∂L/∂W₂ = (2, 0)。",
    blanks: [
      { id: "df", label: "∂L/∂f", accept: ["2"], marks: 1 },
      { id: "w0", label: "∂L/∂W₂ 第一分量", accept: ["2"], marks: 1 },
      { id: "w1", label: "∂L/∂W₂ 第二分量", accept: ["0"], marks: 1 },
    ],
  },
  {
    id: "q1c",
    title: "(c) 传到预激活",
    prompt: "先求 ∂L/∂φ₁，再乘上 ReLU 的导数（a>0 为 1，a<0 为 0），得到 ∂L/∂a₁。",
    explanation:
      "∂L/∂φ₁ = 2(f−y) W₂ = (4, 2)。第二个预激活是 −1，ReLU 导数为 0，所以 ∂L/∂a₁ = (4, 0)。",
    blanks: [
      { id: "g0", label: "∂L/∂φ₁ 第一分量", accept: ["4"], marks: 0.5 },
      { id: "g1", label: "∂L/∂φ₁ 第二分量", accept: ["2"], marks: 0.5 },
      { id: "d0", label: "∂L/∂a₁ 第一分量", accept: ["4"], marks: 0.5 },
      { id: "d1", label: "∂L/∂a₁ 第二分量", accept: ["0"], marks: 0.5 },
    ],
  },
  {
    id: "q1d",
    title: "(d) 哪一列不会动",
    prompt: "做一次梯度下降时，W₁ 的哪一列不会更新？",
    explanation:
      "第二列。第二个隐藏单元的预激活是负的，ReLU 关掉了它，∂L/∂a₁ 的第二分量是 0。W₁ 的第 j 列正比于这个分量，所以第二列的梯度是 0。",
    options: [
      { id: "a", text: "第二列。该单元预激活为负，ReLU 关掉，传到它的梯度是 0" },
      { id: "b", text: "第一列。因为 x 的第一个分量更大" },
      { id: "c", text: "两列都会更新，ReLU 不影响 W₁" },
      { id: "d", text: "第二列。因为 W₂ 的第二个权重是 0" },
    ],
    correctOption: "a",
    optionMarks: 2,
  },
];

const attention: Card["blocks"] = [
  {
    id: "q2a",
    title: "(a) 分数矩阵",
    prompt: "写出 3×3 的原始分数。第 i 行第 j 列是 xᵢ · xⱼ。",
    explanation: "两两点积得到 [[2, 1, 1], [1, 1, 0], [1, 0, 1]]。x₁ 和自己的点积是 1+1=2。",
    columns: 3,
    blanks: [
      { id: "s11", label: "S11", accept: ["2"], marks: 1 / 3 },
      { id: "s12", label: "S12", accept: ["1"], marks: 1 / 3 },
      { id: "s13", label: "S13", accept: ["1"], marks: 1 / 3 },
      { id: "s21", label: "S21", accept: ["1"], marks: 1 / 3 },
      { id: "s22", label: "S22", accept: ["1"], marks: 1 / 3 },
      { id: "s23", label: "S23", accept: ["0"], marks: 1 / 3 },
      { id: "s31", label: "S31", accept: ["1"], marks: 1 / 3 },
      { id: "s32", label: "S32", accept: ["0"], marks: 1 / 3 },
      { id: "s33", label: "S33", accept: ["1"], marks: 1 / 3 },
    ],
  },
  {
    id: "q2b",
    title: "(b) 因果 mask 遮住谁",
    prompt: "因果 mask 会处理这张矩阵里的哪些项？",
    explanation: "遮住对角线上方：S12、S13、S23，设为 −∞，softmax 权重变成 0。位置 i 不能看见更晚的 token。",
    options: [
      { id: "a", text: "对角线上方 S12、S13、S23，设为 −∞，因为不能看未来" },
      { id: "b", text: "整条对角线，因为 token 不能看自己" },
      { id: "c", text: "所有等于 0 的项" },
      { id: "d", text: "只遮住 S33" },
    ],
    correctOption: "a",
    optionMarks: 2,
  },
  {
    id: "q2c",
    title: "(c) 位置 1 和 2 的输出",
    prompt:
      "位置 1 只能看自己。位置 2 对分数 (S21, S22) 做 softmax，再对 value 加权。value 就是 x 本身。输出保留一位小数也可以。",
    explanation:
      "位置 1 的输出就是 v₁ = (1, 1)。位置 2 的分数是 (1, 1)，权重 (0.5, 0.5)，输出 0.5(1,1)+0.5(1,0) = (1, 0.5)。",
    blanks: [
      { id: "o1x", label: "位置 1 输出 x", accept: ["1"], marks: 0.5 },
      { id: "o1y", label: "位置 1 输出 y", accept: ["1"], marks: 0.5 },
      { id: "w1", label: "位置 2 对 token1 的权重", accept: ["0.5", "1/2"], marks: 0.5, show: "0.5" },
      { id: "w2", label: "位置 2 对 token2 的权重", accept: ["0.5", "1/2"], marks: 0.5, show: "0.5" },
      { id: "o2x", label: "位置 2 输出 x", accept: ["1"], marks: 0.5 },
      { id: "o2y", label: "位置 2 输出 y", accept: ["0.5", "1/2"], marks: 0.5, show: "0.5" },
    ],
  },
  {
    id: "q2d",
    title: "(d) 序列变长的代价",
    prompt: "序列长度是 n 时，注意力分数的计算代价怎样随 n 增长？写成 O(n^2) 或 n^2 都可以。",
    explanation: "每对 token 都要一个分数，一共 n² 个。长度翻倍，时间和显存大约变成 4 倍，所以上下文不能无限加长。",
    blanks: [
      {
        id: "cost",
        label: "代价",
        accept: ["n^2", "o(n^2)", "n²", "o(n²)", "n**2", "o(n**2)"],
        marks: 1,
        show: "O(n²)",
      },
    ],
    options: [
      { id: "a", text: "长度翻倍，成本大约变成 4 倍，所以很长的上下文会贵得做不动" },
      { id: "b", text: "成本随 n 线性增长，加长上下文几乎免费" },
      { id: "c", text: "成本只和注意力头的个数有关" },
      { id: "d", text: "mask 之后只剩下 n 个分数" },
    ],
    correctOption: "a",
    optionMarks: 1,
  },
];

const vae: Card["blocks"] = [
  {
    id: "q3a1",
    title: "(a) 第一项在奖励什么",
    prompt: "ELBO 的第一项 E[ln p(x | z)] 在奖励什么？",
    explanation: "它是重建项：从抽到的 z 能把 x 变回来，这一项就大。",
    options: [
      { id: "a", text: "奖励能把 x 重建回来的编码，也就是解码器的对数似然" },
      { id: "b", text: "奖励编码器把方差尽量撑大" },
      { id: "c", text: "惩罚潜变量离开先验" },
      { id: "d", text: "奖励隐藏单元全部变成 0" },
    ],
    correctOption: "a",
    optionMarks: 1,
  },
  {
    id: "q3a2",
    title: "(a) 第二项在惩罚什么",
    prompt: "KL(q(z|x) ‖ p(z)) 这一项在做什么？",
    explanation: "它惩罚编码器的分布离先验太远，让潜空间保持平滑、靠近 p(z)，生成时才能从先验里抽样。",
    options: [
      { id: "a", text: "惩罚 q 离先验太远，好让潜空间可以被抽样来生成" },
      { id: "b", text: "故意把重建误差变大" },
      { id: "c", text: "计算卷积核有多少参数" },
      { id: "d", text: "把学习率固定住" },
    ],
    correctOption: "a",
    optionMarks: 1,
  },
  {
    id: "q3a3",
    title: "(a) 如果去掉 KL",
    prompt: "如果训练时去掉 KL 那一项，会出什么问题？",
    explanation: "编码器可以把方差压到 0，均值随便散开。潜空间出现空洞，从先验抽样就生成不出像样的新数据。",
    options: [
      { id: "a", text: "方差被压到 0，潜空间出现空洞，不能再从先验生成" },
      { id: "b", text: "重建项也会一起消失" },
      { id: "c", text: "模型会变成一个卷积层" },
      { id: "d", text: "注意力不再是因果的" },
    ],
    correctOption: "a",
    optionMarks: 1,
  },
  {
    id: "q3b",
    title: "(b) 算一次 KL",
    prompt: "μ = 1，σ = 2。KL = ½(μ² + σ² − 1 − ln σ²)，保留两位小数。它在什么 μ、σ 下等于 0？",
    explanation: "½(1 + 4 − 1 − ln 4) = ½(4 − 1.386) ≈ 1.31。只有 μ = 0 且 σ = 1 时，q 和标准正态相同，KL 为 0。",
    blanks: [
      { id: "kl", label: "KL", accept: ["1.31", "1.307", "1.30", "1.3"], marks: 1, show: "1.31" },
      { id: "mu", label: "使 KL 为 0 的 μ", accept: ["0"], marks: 0.5 },
      { id: "sigma", label: "使 KL 为 0 的 σ", accept: ["1"], marks: 0.5 },
    ],
  },
  {
    id: "q3c",
    title: "(c) 重参数化",
    prompt: "z ∼ N(μ, σ²) 这一步为什么不能直接反向传播？重参数化把 z 写成 μ 和 σ 的什么函数？ε ∼ N(0, 1)。",
    explanation:
      "“随机抽一个数”对 μ、σ 没有导数，重建损失的梯度传不回编码器。写成 z = μ + σε 之后，随机性全在 ε 里，∂z/∂μ = 1，∂z/∂σ = ε，梯度可以照常走。",
    blanks: [
      {
        id: "z",
        label: "z =",
        accept: ["μ+σε", "μ+σϵ", "μ+σ*ε", "mu+sigma*eps", "mu+sigma*epsilon", "mu+sigma*e", "μ+σ·ε"],
        marks: 2,
        show: "μ + σε",
      },
    ],
    options: [
      { id: "a", text: "抽样不是 μ、σ 的可导函数，重建项的梯度在这里断开" },
      { id: "b", text: "解码器没有参数，所以本来就不需要梯度" },
      { id: "c", text: "因为 ε 必须取 0，随机性可以删掉" },
      { id: "d", text: "KL 已经是闭式，重建项不参加训练" },
    ],
    correctOption: "a",
    optionMarks: 1,
  },
  {
    id: "q3d1",
    title: "(d) 一个 feature 是什么",
    prompt: "稀疏自编码器里说的一个 feature，指的是什么？",
    explanation: "一个隐藏单元，也就是解码器矩阵的一列：语言模型激活空间里的一个方向，只对一小部分输入打开。",
    options: [
      { id: "a", text: "一个隐藏单元，等价于解码器的一列" },
      { id: "b", text: "整个训练集的平均损失" },
      { id: "c", text: "学习率 η" },
      { id: "d", text: "因果 mask 本身" },
    ],
    correctOption: "a",
    optionMarks: 1,
  },
  {
    id: "q3d2",
    title: "(d) 怎样检查它好不好懂",
    prompt: "怎样检查一个 feature 是否可解释？",
    explanation:
      "把这个单元激活最强的文本拿出来，看它们是不是有共同点，比如同一个话题或同一种语言。也可以沿这个方向改激活，看模型输出是否按预期变化。",
    options: [
      { id: "a", text: "看激活最强的文本是否有共同点，或沿该方向改激活看输出是否按预期变" },
      { id: "b", text: "看它的权重是不是整数" },
      { id: "c", text: "看训练损失有没有正好变成 0" },
      { id: "d", text: "看它的维度等不等于词表大小" },
    ],
    correctOption: "a",
    optionMarks: 1,
  },
];

const longQuestions: { id: string; title: string; intro: string; parts: { id: string; title: string; blocks: Block[] }[] }[] = [
  {
    id: "full-q1",
    title: "Q1 反向传播",
    intro: q1Intro,
    parts: [
      { id: "q1a", title: "前向", blocks: [backprop[0]] },
      { id: "q1b", title: "∂L/∂W₂", blocks: [backprop[1]] },
      { id: "q1c", title: "传到 a₁", blocks: [backprop[2]] },
      { id: "q1d", title: "哪一列不动", blocks: [backprop[3]] },
    ],
  },
  {
    id: "full-q2",
    title: "Q2 因果自注意力",
    intro: q2Intro,
    parts: [
      { id: "q2a", title: "分数矩阵", blocks: [attention[0]] },
      { id: "q2b", title: "因果 mask", blocks: [attention[1]] },
      { id: "q2c", title: "两个位置的输出", blocks: [attention[2]] },
      { id: "q2d", title: "O(n²)", blocks: [attention[3]] },
    ],
  },
  {
    id: "full-q3",
    title: "Q3 ELBO 与稀疏特征",
    intro: q3Intro,
    parts: [
      { id: "q3a", title: "两项各自的角色", blocks: [vae[0], vae[1], vae[2]] },
      { id: "q3b", title: "KL 的数值", blocks: [vae[3]] },
      { id: "q3c", title: "重参数化", blocks: [vae[4]] },
      { id: "q3d", title: "稀疏特征", blocks: [vae[5], vae[6]] },
    ],
  },
];

export const longCards: Card[] = longQuestions.flatMap((question) =>
  question.parts.map((part) => ({
    id: part.id,
    kicker: question.title,
    title: part.title,
    intro: question.intro,
    blocks: part.blocks,
  })),
);

export const fullCards: Card[] = longQuestions.map((question) => ({
  id: question.id,
  kicker: "完整大题 · 10 分",
  title: question.title,
  intro: question.intro,
  blocks: question.parts.flatMap((part) => part.blocks),
}));

export const formulaNotes = [
  ["正规方程", "θ* = (XᵀX)⁻¹ Xᵀ y。X 含一列 1，θ 里已经有截距。"],
  ["Sigmoid / Softmax", "σ(x) = 1/(1+e⁻ˣ)。softmax 先取指数，再除以总和。"],
  ["交叉熵", "二分类 L = −y ln p − (1−y) ln(1−p)。多分类只看真实类的 −ln softmax。"],
  ["Momentum / Adam", "Momentum 累积速度 v。Adam 用梯度的均值 m 和梯度平方的均值 s 来缩放步长。"],
  ["卷积", "3×3 核在局部小块上做加权和，权重全图共享。"],
  ["注意力", "softmax(QKᵀ / √d) V。因果 mask 把未来位置的分数设为 −∞。"],
  ["VAE", "ELBO = 重建 − KL。抽样写成 z = μ + σε，梯度才能传回去。"],
];
