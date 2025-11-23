import React, { useState, useMemo } from 'react';
import { 
  Atom, FlaskConical, Globe, Star, Search, 
  ChevronLeft, BarChart3, Image as ImageIcon, Binary, ExternalLink, BookOpen
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// --- TIPOS ---

type Category = 'Todas' | 'Química' | 'Física' | 'Astronomía' | 'Biología' | 'Matemáticas' | 'General';

interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

interface FactEntry {
  id: number;
  title: string;
  category: Category;
  summary: string;
  details: React.ReactNode;
  image?: string; 
  sourceUrl?: string;
  chartData?: ChartDataPoint[];
  chartType?: 'pie' | 'bar';
  chartTitle?: string;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

// --- BASE DE DATOS COMPLETA (LIMPIA) ---

const scienceFacts: FactEntry[] = [
  {
    id: 1,
    title: "El Elemento más abundante",
    category: "Química",
    summary: "Depende de dónde mires: Oxígeno en la corteza, Hierro en el planeta.",
    sourceUrl: "https://es.wikipedia.org/wiki/Abundancia_de_los_elementos_qu%C3%ADmicos",
    chartType: 'bar',
    chartTitle: "Abundancia en Corteza (%)",
    chartData: [
      { name: 'Oxígeno', value: 46.71, fill: '#3b82f6' },
      { name: 'Silicio', value: 27.69, fill: '#64748b' },
      { name: 'Aluminio', value: 8.07, fill: '#94a3b8' },
      { name: 'Hierro', value: 5.05, fill: '#ef4444' },
      { name: 'Otros', value: 12.48, fill: '#cbd5e1' },
    ],
    details: (
      <>
        <p className="mb-4">Es fundamental distinguir el contexto. Si tomamos una muestra de la corteza terrestre (donde vivimos), el Oxígeno es el elemento dominante (46.7%).</p>
        <p>Sin embargo, si consideramos la Tierra entera, el Hierro es el elemento más abundante (35%), concentrándose masivamente en el núcleo.</p>
      </>
    )
  },
  {
    id: 2,
    title: "Hierro: Núcleo vs Corteza",
    category: "Química",
    summary: "El núcleo de la Tierra es casi enteramente hierro.",
    details: <p>El núcleo interno sólido es casi puro hierro, y el externo líquido es una aleación de hierro y níquel. En total, el hierro compone el 35% de la masa de la Tierra.</p>
  },
  {
    id: 3,
    title: "Materia Oscura y Energía Oscura",
    category: "Astronomía",
    summary: "El 96% del universo es invisible para nosotros.",
    chartType: 'pie',
    chartTitle: "Composición del Universo",
    chartData: [
      { name: 'Energía Oscura', value: 73, fill: '#1e293b' },
      { name: 'Materia Oscura', value: 23, fill: '#475569' },
      { name: 'Materia Visible', value: 4, fill: '#facc15' },
    ],
    details: <p>Solo el 4% del universo es materia bariónica (estrellas, planetas, nosotros). El 23% es materia oscura (que mantiene unidas las galaxias) y el 73% es energía oscura (que acelera la expansión).</p>
  },
  {
    id: 4,
    title: "Producción de Plutonio-239",
    category: "Física",
    summary: "Cómo el Uranio se convierte en combustible nuclear.",
    image: "/images/fact_4.jpg",
    details: (
      <div className="space-y-4">
        <p>El Pu-239 se produce cuando el Uranio-238 captura un neutrón. Pasa por dos desintegraciones beta:</p>
        <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded font-mono text-sm">
          U-238 + n → U-239 → Np-239 → Pu-239
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Composición Atmosférica",
    category: "Química",
    summary: "Nitrógeno (78%), Oxígeno (21%) y el resto son trazas.",
    chartType: 'pie',
    chartData: [
      { name: 'Nitrógeno', value: 78.08, fill: '#60a5fa' },
      { name: 'Oxígeno', value: 20.95, fill: '#34d399' },
      { name: 'Argón', value: 0.93, fill: '#a78bfa' },
      { name: 'Otros', value: 0.04, fill: '#f472b6' },
    ],
    details: <p>El aire es 78% Nitrógeno y 21% Oxígeno. El Argón ocupa el tercer lugar (0.93%). El CO2 es apenas el 0.04%.</p>
  },
  {
    id: 6,
    title: "Fisión del Uranio-235",
    category: "Física",
    summary: "Romper un átomo libera enorme energía.",
    image: "/images/fact_6.jpg",
    details: <p>La fisión de un átomo de U-235 libera 200 MeV, lo cual es 50 veces más energía que la desintegración alfa natural del mismo núcleo.</p>
  },
  {
    id: 7,
    title: "Neutrinos Solares",
    category: "Física",
    summary: "Billones te atraviesan sin tocarte.",
    details: <p>Si apuntas tu pulgar al Sol, en 3 segundos pasan 200 mil millones (2x10^11) de neutrinos a través de tu uña.</p>
  },
  {
    id: 8,
    title: "Isótopos del Carbono",
    category: "Química",
    summary: "Estable vs Radiactivo.",
    details: <p>El Carbono-12 es estable y constituye el 98.9% del carbono. El Carbono-14 es inestable (radiactivo) y se usa para datación.</p>
  },
  {
    id: 9,
    title: "Cadena Protón-Protón",
    category: "Astronomía",
    summary: "El motor del Sol.",
    image: "/images/fact_9.jpg",
    details: <p>Es la cadena principal de fusión en las estrellas, donde el hidrógeno se convierte en helio liberando energía.</p>
  },
  {
    id: 10,
    title: "Potasio-40",
    category: "Biología",
    summary: "Radiactividad natural en el cuerpo.",
    details: <p>El Potasio-40 es un isótopo radiactivo natural. Debido a su presencia en alimentos (como plátanos), todos los seres vivos somos ligeramente radiactivos.</p>
  },
  {
    id: 11,
    title: "Formación de Carbono-14",
    category: "Física",
    summary: "Rayos cósmicos golpeando nitrógeno.",
    details: <p>Los rayos cósmicos chocan con la atmósfera creando neutrones. Estos neutrones golpean átomos de Nitrógeno-14 y los transforman en Carbono-14.</p>
  },
  {
    id: 12,
    title: "Átomos vs Estrellas",
    category: "Astronomía",
    summary: "La inmensidad de lo pequeño.",
    details: <p>Hay más átomos en un ojo humano (~10^23) que estrellas en todo el universo observable (~10^22-24).</p>
  },
  {
    id: 13,
    title: "Detector IceCube",
    category: "Física",
    summary: "Un telescopio bajo el hielo antártico.",
    image: "/images/fact_13.jpg",
    details: <p>Utiliza 5,160 sensores enterrados en un kilómetro cúbico de hielo en el Polo Sur para detectar los destellos de radiación cuando un neutrino choca.</p>
  },
  {
    id: 14,
    title: "Composición del Manto",
    category: "Química",
    summary: "Silicatos de hierro y magnesio.",
    details: <p>El manto terrestre está compuesto principalmente de silicatos de hierro y magnesio. Esto hace que el Magnesio sea el cuarto elemento más abundante de la Tierra.</p>
  },
  {
    id: 15,
    title: "Enriquecimiento de Uranio",
    category: "Física",
    summary: "Diferencia entre energía y armas.",
    details: <p>Para reactores nucleares civiles se necesita Uranio enriquecido al 5%. Para armas nucleares, se requiere un 90%.</p>
  },
  {
    id: 16,
    title: "Cadena de Desintegración",
    category: "Física",
    summary: "Del Uranio al Plomo.",
    details: <p>El Uranio-238 se desintegra pasando por Torio, Radio y Radón, hasta convertirse finalmente en Plomo estable.</p>
  },
  {
    id: 17,
    title: "Tabla Periódica Radiactiva",
    category: "Física",
    summary: "Elementos clave.",
    details: <p>Secuencia importante: 86-Radón, 88-Radio, 90-Torio, 92-Uranio, 94-Plutonio.</p>
  },
  {
    id: 18,
    title: "Misterio Alfa-Beta",
    category: "Física",
    summary: "¿Por qué no radiación neutrón-protón?",
    details: <p>La partícula Alfa (núcleo de Helio) es extremadamente estable, por lo que es energéticamente favorable emitirla completa en lugar de neutrones o protones sueltos.</p>
  },
  {
    id: 19,
    title: "Ajedrez vs Universo",
    category: "Matemáticas",
    summary: "Complejidad combinatoria.",
    details: <p>Hay más partidas posibles de ajedrez (~10^120) que átomos en el universo observable (~10^81).</p>
  },
  {
    id: 20,
    title: "Longitud de Planck",
    category: "Física",
    summary: "El píxel del universo.",
    details: <p>Es aprox 1.6 x 10^-35 metros. Se teoriza que es la distancia mínima posible donde el espacio-tiempo deja de ser continuo.</p>
  },
  {
    id: 21,
    title: "Pirita",
    category: "Química",
    summary: "El oro de los tontos.",
    details: <p>Su fórmula es FeS2 (Sulfuro de Hierro). Brilla como oro pero no lo es.</p>
  },
  {
    id: 22,
    title: "El Mol",
    category: "Química",
    summary: "El número de Avogadro.",
    details: <p>6.022 x 10^23 unidades. Es la cantidad de átomos exacta para convertir la masa atómica en gramos.</p>
  },
  {
    id: 23,
    title: "Julios y Newtons",
    category: "Física",
    summary: "Unidades de energía.",
    details: <p>Un Julio es la fuerza de 1 Newton aplicada en 1 metro. Se requiere la fisión de 31 mil millones de átomos de Uranio para producir 1 Julio.</p>
  },
  {
    id: 24,
    title: "Reacciones REDOX",
    category: "Química",
    summary: "Intercambio de electrones.",
    details: <p>Oxidación es perder electrones. Reducción es ganar electrones. Siempre ocurren simultáneamente.</p>
  },
  {
    id: 25,
    title: "Masa del Nucleón",
    category: "Física",
    summary: "La masa es energía.",
    details: <p>La masa de los quarks solo explica una pequeña parte de la masa del protón. La mayor parte proviene de la energía cinética de los gluones (E=mc²).</p>
  },
  {
    id: 26,
    title: "Electronvoltio (eV)",
    category: "Física",
    summary: "Energía a escala atómica.",
    details: <p>Es la energía cinética que gana un electrón al ser acelerado por 1 voltio. 1 eV = 1.6 x 10^-19 Julios.</p>
  },
  {
    id: 27,
    title: "Factor Gamma",
    category: "Física",
    summary: "Dilatación temporal.",
    image: "/images/fact_27.jpg",
    details: <p>Si viajas al 99.99% de la velocidad de la luz por 1 año, en la Tierra habrán pasado 70 años. Es viajar al futuro.</p>
  },
  {
    id: 28,
    title: "El Método Científico",
    category: "General",
    summary: "Las reglas de Carl Sagan.",
    sourceUrl: "https://es.wikipedia.org/wiki/Cosmos:_un_viaje_personal",
    details: (
      <div>
        <p className="text-lg font-medium text-slate-800 dark:text-slate-200">Reglas esenciales:</p>
        <p className="mt-2">"Pon a prueba las ideas con experimentación. Construye sobre lo que pase la prueba. Rechaza lo que falle."</p>
        
        <br className="hidden md:block" /> 
        
        <div className="mt-8 pl-6 border-l-4 border-indigo-500 italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-r-lg shadow-sm">
            <p className="leading-relaxed">
            “Esta aventura es hecha posible por generaciones de buscadores, estrictamente adheridos a un simple conjunto de reglas: pon a prueba las ideas a través de la experimentación y la observación; construye sobre las ideas que pasen la prueba; rechaza las que fallen; sigue la evidencia hacia dónde sea que te lleve y cuestiónalo todo. Acepta estos términos…y el Cosmos es tuyo.”
            </p>
        </div>
      </div>
    )
  },
  {
    id: 29,
    title: "Enantiómeros (Quiralidad)",
    category: "Química",
    summary: "Moléculas espejo con distinto olor.",
    image: "/images/fact_29.jpg",
    details: (
      <div className="space-y-2">
        <p>Son moléculas idénticas pero reflejadas (como manos izquierda y derecha). Sus propiedades biológicas cambian:</p>
        <ul className="list-disc pl-5">
          <li><strong>Limoneno:</strong> D-Limoneno huele a Naranja 🍊. L-Limoneno huele a Pino 🌲.</li>
          <li><strong>Carvona:</strong> Un isómero huele a menta, el otro a comino.</li>
        </ul>
      </div>
    )
  },
  {
    id: 30,
    title: "Distribución de Poisson",
    category: "Matemáticas",
    summary: "Matemática de sucesos raros.",
    image: "/images/fact_30.jpg",
    details: <p>Calcula la probabilidad de que ocurran 'k' eventos en un tiempo fijo. Requisito vital: los eventos deben ser independientes. El contagio de gripe NO sirve, pero llamadas a un call center SÍ.</p>
  },
  {
    id: 31,
    title: "Fuego de San Telmo",
    category: "Física",
    summary: "Plasma en los barcos.",
    details: <p>No es fuego real, es un plasma (aire ionizado) que brilla en las puntas de los mástiles de barcos durante tormentas eléctricas fuertes.</p>
  },
  {
    id: 32,
    title: "Efecto Corona",
    category: "Física",
    summary: "Ionización del aire.",
    details: <p>Es el fenómeno detrás del Fuego de San Telmo. Ocurre en líneas de alta tensión, ionizando el aire y produciendo Ozono y un brillo violeta.</p>
  },
  {
    id: 33,
    title: "Cuerpo Humano (% Masa)",
    category: "Biología",
    summary: "Oxígeno es el rey del peso.",
    chartType: 'bar',
    chartData: [
      { name: 'Oxígeno', value: 65, fill: '#ef4444' },
      { name: 'Carbono', value: 18, fill: '#3b82f6' },
      { name: 'Hidrógeno', value: 10, fill: '#eab308' },
      { name: 'Nitrógeno', value: 3, fill: '#22c55e' },
      { name: 'Otros', value: 4, fill: '#94a3b8' },
    ],
    details: <p>Por masa, somos 65% oxígeno (principalmente por el agua) y 18% carbono. También tenemos 0.2mg de Oro.</p>
  },
  {
    id: 34,
    title: "Átomos en un gramo",
    category: "Química",
    summary: "La escala de Avogadro.",
    details: <p>Para saber cuántos átomos hay en un gramo, se divide la constante de Avogadro por la masa atómica. En 1g de U-235 hay ~2.5 x 10^21 átomos.</p>
  },
  {
    id: 35,
    title: "Cuerpo Humano (% Átomos)",
    category: "Biología",
    summary: "Hidrógeno es el rey numérico.",
    chartType: 'pie',
    chartData: [
      { name: 'Hidrógeno', value: 63, fill: '#eab308' },
      { name: 'Oxígeno', value: 24, fill: '#ef4444' },
      { name: 'Carbono', value: 12, fill: '#3b82f6' },
      { name: 'Otros', value: 1, fill: '#cbd5e1' },
    ],
    details: <p>Aunque el oxígeno pesa más, el Hidrógeno es más numeroso (el 63% de tus átomos) porque es muy ligero y hay dos en cada molécula de agua.</p>
  },
  {
    id: 36,
    title: "Eppur si muove",
    category: "Astronomía",
    summary: "Y sin embargo, se mueve.",
    details: <p>Frase atribuida a Galileo tras ser forzado a negar que la Tierra se movía alrededor del Sol. Representa la persistencia de la verdad científica.</p>
  },
  {
    id: 37,
    title: "Sistema Solar",
    category: "Astronomía",
    summary: "Abundancia de elementos local.",
    image: "/images/fact_37.jpg",
    details: <p>En nuestro sistema solar, el Hidrógeno (70%) y el Helio (27%) dominan absolutamente. Todo lo demás es "residuo" (menos del 2%).</p>
  },
  {
    id: 38,
    title: "Vía Láctea",
    category: "Astronomía",
    summary: "Abundancia galáctica.",
    details: <p>Similar al sistema solar: 74% Hidrógeno, 24% Helio. El oxígeno es el tercero, pero apenas llega al 1%.</p>
  },
  {
    id: 39,
    title: "Electrólisis y Potenciales",
    category: "Química",
    summary: "La batalla de los iones.",
    details: <p>En la electrólisis de salmuera (agua con sal), se libera Cloro en vez de Oxígeno porque el Cloro tiene un potencial de electrodo que favorece su oxidación en esas condiciones.</p>
  },
  {
    id: 40,
    title: "Can Mayor",
    category: "Astronomía",
    summary: "Nuestra vecina más cercana.",
    details: <p>La galaxia más cercana a la Vía Láctea NO es Andrómeda, sino la Galaxia Enana del Can Mayor, a solo 25,000 años luz.</p>
  },
  {
    id: 41,
    title: "Glutamato",
    category: "Biología",
    summary: "Sabor y Neurotransmisor.",
    details: <p>Es el responsable del sabor 'Umami' en la comida, pero también es el principal neurotransmisor excitador del cerebro humano.</p>
  },
  {
    id: 42,
    title: "Números Naturales",
    category: "Matemáticas",
    summary: "Conjuntos infinitos.",
    details: <p>Son los números para contar (1, 2, 3...). Existe debate sobre si incluir el 0. El conjunto se denota con N.</p>
  }
];

// --- COMPONENTES VISUALES ---

// NOTA: Usamos 'any' en data para evitar conflictos estrictos de TypeScript con Recharts
const DataVisualizer = ({ data, type, title }: { data: any[], type: 'pie' | 'bar', title?: string }) => {
  if (!data) return null;

  return (
    <div className="my-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
      {title && <h4 className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">{title}</h4>}
      <div className="h-64 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} contentStyle={{backgroundColor: '#fff', borderRadius: '8px', color: '#000'}} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          ) : (
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip formatter={(value) => `${value}%`} cursor={{fill: 'transparent'}} contentStyle={{color: '#000', borderRadius: '8px'}} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- VISTA PRINCIPAL (GRID) ---

const FactCard = ({ fact, onClick }: { fact: FactEntry; onClick: () => void }) => {
  const categoryColor = {
    'Química': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Física': 'bg-violet-100 text-violet-800 border-violet-200',
    'Astronomía': 'bg-blue-100 text-blue-800 border-blue-200',
    'Biología': 'bg-rose-100 text-rose-800 border-rose-200',
    'Matemáticas': 'bg-amber-100 text-amber-800 border-amber-200',
    'General': 'bg-gray-100 text-gray-800 border-gray-200',
    'Todas': 'bg-gray-100'
  }[fact.category];

  return (
    <div 
        onClick={onClick}
        className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col cursor-pointer h-full"
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${categoryColor}`}>
            {fact.category}
          </span>
          <div className="flex gap-2 text-slate-300 group-hover:text-indigo-500 transition-colors">
             {fact.image && <ImageIcon size={16} />}
             {fact.chartData && <BarChart3 size={16} />}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {fact.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
          {fact.summary}
        </p>

        <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-700 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Leer más <ChevronLeft size={12} className="rotate-180" />
        </div>
      </div>
    </div>
  );
};

// --- VISTA DE DETALLE (PÁGINA COMPLETA) ---

const DetailView = ({ fact, onBack }: { fact: FactEntry; onBack: () => void }) => {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const categoryColor = {
        'Química': 'text-emerald-600 bg-emerald-50',
        'Física': 'text-violet-600 bg-violet-50',
        'Astronomía': 'text-blue-600 bg-blue-50',
        'Biología': 'text-rose-600 bg-rose-50',
        'Matemáticas': 'text-amber-600 bg-amber-50',
        'General': 'text-slate-600 bg-slate-50',
        'Todas': ''
    }[fact.category];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 animate-fadeIn">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Botón Volver */}
                <button 
                    onClick={onBack}
                    className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                >
                    <ChevronLeft size={20} /> Volver al listado
                </button>

                {/* Encabezado */}
                <div className="mb-8">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${categoryColor}`}>
                        {fact.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mt-4 mb-6 leading-tight">
                        {fact.title}
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                        {fact.summary}
                    </p>
                </div>

                {/* Contenido Principal */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Columna Izquierda: Texto y Datos */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Imagen Principal si existe */}
                        {fact.image && (
                            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                                <img 
                                    src={fact.image} 
                                    alt={fact.title}
                                    className="w-full h-auto object-cover"
                                    onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                />
                            </div>
                        )}

                        <div className="prose prose-lg dark:prose-invert text-slate-700 dark:text-slate-300 leading-loose">
                            {fact.details}
                        </div>

                        {/* Botón de Fuente Externa */}
                        {fact.sourceUrl && (
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <a 
                                    href={fact.sourceUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors font-medium"
                                >
                                    <BookOpen size={18} />
                                    Investigar más sobre este tema
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Columna Derecha: Gráficos y Sidebar */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24">
                            {fact.chartData ? (
                                <DataVisualizer 
                                    data={fact.chartData} 
                                    type={fact.chartType || 'pie'} 
                                    title={fact.chartTitle || "Datos Clave"} 
                                />
                            ) : (
                                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                                    <Atom size={40} className="mx-auto text-indigo-300 mb-3" />
                                    <p className="text-sm text-slate-500">Dato verificado científicamente</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL (APP) ---

const Header = () => (
  <header className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white shadow-lg sticky top-0 z-50">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-full">
          <Atom size={24} className="animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">CurioCiencia</h1>
          <p className="text-xs text-indigo-200 hidden md:block">42 Hechos fascinantes del universo</p>
        </div>
      </div>
    </div>
  </header>
);

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFact, setActiveFact] = useState<FactEntry | null>(null);

  const filteredFacts = useMemo(() => {
    return scienceFacts.filter(fact => {
      const matchesCategory = selectedCategory === 'Todas' || fact.category === selectedCategory;
      const matchesSearch = fact.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            fact.summary.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const categories: { label: Category; icon: any }[] = [
    { label: 'Todas', icon: Globe },
    { label: 'Física', icon: Atom },
    { label: 'Química', icon: FlaskConical },
    { label: 'Astronomía', icon: Star },
    { label: 'Biología', icon: Globe },
    { label: 'Matemáticas', icon: Binary },
  ];

  // RENDERIZADO CONDICIONAL
  if (activeFact) {
      return <DetailView fact={activeFact} onBack={() => setActiveFact(null)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Controles */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedCategory === cat.label 
                    ? 'bg-indigo-600 text-white shadow-md scale-105' 
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 border border-slate-200 dark:border-slate-800'}
                `}
              >
                <cat.icon size={14} />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid de Hechos */}
        {filteredFacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacts.map(fact => (
              <FactCard 
                key={fact.id} 
                fact={fact} 
                onClick={() => setActiveFact(fact)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-50">
            <p className="text-xl">No se encontraron resultados.</p>
          </div>
        )}
      </main>
    </div>
  );
}