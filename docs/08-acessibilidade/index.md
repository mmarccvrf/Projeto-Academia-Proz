# ♿ Acessibilidade Digital no Projeto Academia Proz

Este módulo detalha os conceitos, decisões de design e a implementação técnica das ferramentas de acessibilidade incluídas no MVP do **Projeto Academia Proz**, garantindo que o aplicativo web responsivo seja inclusivo e utilizável por um público mais amplo.

---

## 🎯 Por que focar em Acessibilidade na Academia?

No ambiente de uma academia, a usabilidade sofre interferências externas drásticas devido ao contexto físico. Fatores como **tremores musculares pós-exercício, suor, telas com reflexo de luz direta e o próprio movimento do usuário** criam barreiras de uso temporárias. 

Além disso, pessoas com condições visuais como **presbiopia (vista cansada), miopia ou astigmatismo** frequentemente treinam sem seus óculos de grau por conforto ou segurança, demandando interfaces adaptáveis.

---

## 🛠️ Implementação Técnica: Fontes Dinâmicas com `.rem`

A principal funcionalidade de acessibilidade deste MVP é o **motor de redimensionamento de texto em tempo real**. Ao contrário de abordagens antigas que quebravam o layout, nossa arquitetura utiliza uma abordagem moderna e robusta baseada em **Variáveis CSS** e unidades relativas (**`rem`**).

### Como funciona o fluxo:

1. **Definição da Raiz (`html`):** O tamanho de fonte global do aplicativo foi atrelado a uma variável nativa do CSS (`--base-font-size`), inicializada em `16px`.
2. **Escala Relativa (`rem`):** Todos os textos (`h2`, `p`, `span`, botões), espaçamentos internos (`padding`), margens (`margin`) e cantos arredondados (`border-radius`) foram convertidos e declarados em unidades `rem`. 
   * *Exemplo:* Um elemento com `font-size: 1.25rem` passará dinamicamente de `20px` para `25px` se o valor da raiz mudar.
3. **Injeção de JavaScript Limpa:** Os botões do painel acionam funções que manipulam apenas a propriedade raiz do documento (`document.documentElement`), fazendo com que toda a interface se reajuste proporcionalmente e de forma instantânea sem desalinhar os blocos ou quebrar o encapsulamento do "smartphone virtual".

---

## 🔍 Trecho do Código Implementado

### Configuração no CSS (`style.css`)
```css
html {
    /* Define o tamanho inicial padrão dinâmico */
    --base-font-size: 16px; 
    font-size: var(--base-font-size);
}

.user-header h2 { 
    font-size: 1.25rem; /* Responde proporcionalmente às mudanças da raiz */
}
```

### Motor de Controle no JS (`script.js`)
```javascript
let currentSize = 16; 
const minSize = 12; // Evita que o texto fique ilegível por estar muito pequeno
const maxSize = 22; // Evita que elementos quebrem as bordas físicas do container

function changeFontSize(modifier) {
    currentSize += modifier;
    
    if (currentSize < minSize) currentSize = minSize;
    if (currentSize > maxSize) currentSize = maxSize;
    
    // Atualiza a variável CSS do HTML em tempo de execução
    document.documentElement.style.setProperty('--base-font-size', currentSize + 'px');
}
```

---

## 🚀 Próximos Passos para Acessibilidade (Post-MVP)

Para evoluir o produto além do Mínimo Produto Viável nas próximas *sprints*, estão mapeadas as seguintes melhorias na pasta `08-acessibilidade`:

*   **Atributos ARIA (Accessible Rich Internet Applications):** Inclusão de marcadores como `aria-live="polite"` no cronômetro de descanso, para que leitores de tela avisem usuários com deficiência visual quando o tempo acabar, mesmo se o app estiver em segundo plano.
*   **Contraste Avançado (WCAG AAA):** Ajuste fino do cinza dos textos (`--text-grey`) e do fundo das caixas para atingir a taxa de contraste mínima de **7:1** contra o fundo preto, facilitando a leitura sob forte luz solar ou iluminação forte de estúdios de treino.
*   **Suporte a Navegação por Teclado/Gestos:** Garantir que o foco de seleção passe ordenadamente pelos botões através do atributo `tabindex`, permitindo que usuários que utilizam chaves de acessibilidade motora naveguem pelas séries facilmente.
