import { useState, useEffect } from 'react';

function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [isDeg, setIsDeg] = useState(true);
  const [mode, setMode] = useState('normal');

  const toRad = (deg) => (deg * Math.PI) / 180;

  const handleClick = (val) => {
    if (val === 'C') {
      setExpression('');
      setResult('0');
    } else if (val === '⌫') {
      setExpression((prev) => prev.slice(0, -1));
    } else if (val === '=') {
      calculate();
    } else if (val === 'x²') {
      setExpression(expression + '**2');
    } else if (val === 'x³') {
      setExpression(expression + '**3');
    } else if (val === '1/x') {
      setExpression('1/(' + expression + ')');
    } else if (val === '|x|') {
      setExpression('Math.abs(' + expression + ')');
    } else if (val === '10^x') {
      setExpression('10**(' + expression + ')');
    } else if (val === 'xʸ') {
      setExpression(expression + '**');
    } else if (val === '√') {
      setExpression('Math.sqrt(' + expression + ')');
    } else if (val === '∛') {
      setExpression('Math.cbrt(' + expression + ')');
    } else if (val === '!') {
      const match = expression.match(/(\d+\.?\d*)$/);
      if (match) {
        let n = parseFloat(match[0]);
        if (Number.isInteger(n) && n >= 0 && n <= 170) {
          let fact = 1;
          for (let i = 2; i <= n; i++) fact *= i;
          setExpression(expression.replace(/(\d+\.?\d*)$/, fact.toString()));
        } else {
          setResult('Error');
        }
      }
    } else if (val === 'sin(' || val === 'cos(' || val === 'tan(') {
      setExpression(expression + val);
    } else if (val === 'sin⁻¹(' || val === 'cos⁻¹(' || val === 'tan⁻¹(') {
      setExpression(expression + 'Math.a' + val.slice(1));
    } else if (val === 'sinh(' || val === 'cosh(' || val === 'tanh(') {
      setExpression(expression + 'Math.' + val);
    } else if (val === 'ln(') {
      setExpression(expression + 'Math.log(');
    } else if (val === 'log₁₀(') {
      setExpression(expression + 'Math.log10(');
    } else if (val === 'log₂(') {
      setExpression(expression + 'Math.log2(');
    } else {
      setExpression((prev) => prev + val);
    }
  };

  const calculate = () => {
    if (!expression.trim()) return;
    try {
      // Reemplazar funciones trigonométricas con manejo de grados/radianes
      let expr = expression
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/∛\(/g, 'Math.cbrt(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/log₁₀\(/g, 'Math.log10(')
        .replace(/log₂\(/g, 'Math.log2(');

      // Manejar funciones trigonométricas con DEG/RAD
      if (isDeg) {
        expr = expr
          .replace(/sin\(/g, 'Math.sin(toRad(')
          .replace(/cos\(/g, 'Math.cos(toRad(')
          .replace(/tan\(/g, 'Math.tan(toRad(')
          .replace(/Math.asin\(/g, 'toDeg(Math.asin(')
          .replace(/Math.acos\(/g, 'toDeg(Math.acos(')
          .replace(/Math.atan\(/g, 'toDeg(Math.atan(');
        
        // Añadir paréntesis de cierre para toRad
        const openParenCount = (expr.match(/toRad\(/g) || []).length;
        for (let i = 0; i < openParenCount; i++) {
          expr += ')';
        }
      } else {
        expr = expr
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(');
      }

      // Función auxiliar para convertir radianes a grados (para funciones inversas)
      const toDeg = (rad) => (rad * 180) / Math.PI;

      const res = new Function('toRad', 'toDeg', `return ${expr}`)(toRad, toDeg);
      const formatted = Number.isFinite(res)
        ? (Math.abs(res) < 1e10 ? res.toString() : res.toExponential(6))
        : 'Error';
      setResult(formatted);
      setExpression(formatted);
    } catch (error) {
      console.error(error);
      setResult('Error');
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Enter' || e.key === '=') calculate();
      if (e.key === 'Backspace') setExpression((p) => p.slice(0, -1));
      if (e.key === 'Escape') { setExpression(''); setResult('0'); }
      if ('0123456789.+-*/()^'.includes(e.key)) setExpression((p) => p + e.key);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [expression]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-[450px] bg-gray-900 rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-2 flex justify-between items-center bg-gray-800/30">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('normal')}
              className={`text-xs px-3 py-1.5 rounded transition ${
                mode === 'normal' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setMode('cientifico')}
              className={`text-xs px-3 py-1.5 rounded transition ${
                mode === 'cientifico' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Científico
            </button>
          </div>
          {mode === 'cientifico' && (
            <button
              onClick={() => setIsDeg(!isDeg)}
              className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300 hover:bg-gray-600"
            >
              {isDeg ? 'DEG' : 'RAD'}
            </button>
          )}
        </div>

        {/* Pantalla */}
        <div className="px-4 py-4 bg-gray-950">
          <div className="text-right text-xs text-gray-500 font-light break-all min-h-[1.2rem]">
            {expression || '0'}
          </div>
          <div className="text-right text-3xl font-light text-white mt-1 tracking-tight">
            {result}
          </div>
        </div>

        {/* Teclado - Modo Normal */}
        {mode === 'normal' && (
          <div className="p-2 bg-gray-900">
            {/* Fila de operaciones superiores */}
            <div className="grid grid-cols-4 gap-1 mb-1">
              {['C', '⌫', '%', '/'].map((label) => (
                <button
                  key={label}
                  onClick={() => handleClick(label)}
                  className={`h-10 text-sm font-medium rounded-lg transition active:scale-95 ${
                    label === 'C' || label === '⌫'
                      ? 'bg-red-800/80 hover:bg-red-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-orange-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Teclado numérico con operaciones a la derecha */}
            <div className="grid grid-cols-4 gap-1">
              {/* Columna izquierda - Números y punto */}
              <div className="col-span-3 grid grid-cols-3 gap-1">
                {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleClick(num.toString())}
                    className="h-10 text-lg font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition active:scale-95"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => handleClick('0')}
                  className="h-10 text-lg font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition active:scale-95 col-span-2"
                >
                  0
                </button>
                <button
                  onClick={() => handleClick('.')}
                  className="h-10 text-lg font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition active:scale-95"
                >
                  .
                </button>
              </div>

              {/* Columna derecha - Operaciones */}
              <div className="grid grid-cols-1 gap-1">
                {['*', '-', '+', '='].map((op) => (
                  <button
                    key={op}
                    onClick={() => handleClick(op)}
                    className={`h-10 text-lg font-medium rounded-lg transition active:scale-95 ${
                      op === '='
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-orange-400'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            {/* Fila inferior de paréntesis */}
            <div className="grid grid-cols-4 gap-1 mt-1">
              {['(', ')', 'π', 'e'].map((label) => (
                <button
                  key={label}
                  onClick={() => handleClick(label)}
                  className="h-8 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition active:scale-95"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Teclado - Modo Científico */}
        {mode === 'cientifico' && (
          <div className="p-2 bg-gray-900">
            {/* Fila 1 - Funciones trigonométricas básicas */}
            <div className="grid grid-cols-5 gap-1 mb-1">
              {['sin(', 'cos(', 'tan(', 'C', '⌫'].map((label) => (
                <button
                  key={label}
                  onClick={() => handleClick(label)}
                  className={`h-8 text-xs rounded-lg transition active:scale-95 ${
                    label === 'C' || label === '⌫'
                      ? 'bg-red-800/80 hover:bg-red-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-cyan-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Fila 2 - Funciones inversas */}
            <div className="grid grid-cols-5 gap-1 mb-1">
              {['sin⁻¹(', 'cos⁻¹(', 'tan⁻¹(', '%', '/'].map((label) => (
                <button
                  key={label}
                  onClick={() => handleClick(label)}
                  className={`h-8 text-xs rounded-lg transition active:scale-95 ${
                    label === '%' || label === '/'
                      ? 'bg-gray-800 hover:bg-gray-700 text-orange-400'
                      : 'bg-gray-800 hover:bg-gray-700 text-cyan-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Fila 3 - Funciones hiperbólicas */}
            <div className="grid grid-cols-5 gap-1 mb-1">
              {['sinh(', 'cosh(', 'tanh(', '*', '-'].map((label) => (
                <button
                  key={label}
                  onClick={() => handleClick(label)}
                  className={`h-8 text-xs rounded-lg transition active:scale-95 ${
                    label === '*' || label === '-'
                      ? 'bg-gray-800 hover:bg-gray-700 text-orange-400'
                      : 'bg-gray-800 hover:bg-gray-700 text-cyan-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Fila 4 - Logaritmos y raíces */}
            <div className="grid grid-cols-5 gap-1 mb-1">
              {['ln(', 'log₁₀(', 'log₂(', '+', '√('].map((label) => (
                <button
                  key={label}
                  onClick={() => handleClick(label)}
                  className={`h-8 text-xs rounded-lg transition active:scale-95 ${
                    label === '+' 
                      ? 'bg-gray-800 hover:bg-gray-700 text-orange-400'
                      : label === '√('
                      ? 'bg-gray-800 hover:bg-gray-700 text-cyan-300'
                      : 'bg-gray-800 hover:bg-gray-700 text-cyan-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Fila 5 - Potencias y operaciones especiales */}
            <div className="grid grid-cols-5 gap-1 mb-1">
              {['x²', 'x³', 'xʸ', '10^x', '∛('].map((label) => (
                <button
                  key={label}
                  onClick={() => handleClick(label)}
                  className="h-8 text-xs bg-gray-800 hover:bg-gray-700 text-cyan-300 rounded-lg transition active:scale-95"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Fila 6 - Más funciones */}
            <div className="grid grid-cols-5 gap-1 mb-2">
              {['|x|', '1/x', '!', 'π', 'e'].map((label) => (
                <button
                  key={label}
                  onClick={() => handleClick(label)}
                  className="h-8 text-xs bg-gray-800 hover:bg-gray-700 text-cyan-300 rounded-lg transition active:scale-95"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Teclado numérico con operaciones */}
            <div className="grid grid-cols-5 gap-1">
              {/* Números y operaciones */}
              {[7, 8, 9, '(', ')'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleClick(item.toString())}
                  className={`h-10 text-sm font-medium rounded-lg transition active:scale-95 ${
                    typeof item === 'number'
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {item}
                </button>
              ))}
              
              {[4, 5, 6, '*', '/'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleClick(item.toString())}
                  className={`h-10 text-sm font-medium rounded-lg transition active:scale-95 ${
                    typeof item === 'number'
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                      : 'bg-gray-800 hover:bg-gray-700 text-orange-400'
                  }`}
                >
                  {item}
                </button>
              ))}

              {[1, 2, 3, '+', '-'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleClick(item.toString())}
                  className={`h-10 text-sm font-medium rounded-lg transition active:scale-95 ${
                    typeof item === 'number'
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                      : 'bg-gray-800 hover:bg-gray-700 text-orange-400'
                  }`}
                >
                  {item}
                </button>
              ))}

              {/* Fila final */}
              <button
                onClick={() => handleClick('0')}
                className="h-10 text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition active:scale-95 col-span-2"
              >
                0
              </button>
              <button
                onClick={() => handleClick('.')}
                className="h-10 text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition active:scale-95"
              >
                .
              </button>
              <button
                onClick={() => handleClick('=')}
                className="h-10 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition active:scale-95 col-span-2"
              >
                =
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-1 text-center text-xs text-gray-600 bg-gray-900 border-t border-gray-800">
          {mode === 'normal' ? 'Modo Normal · ⌨️' : 'Modo Científico · ⌨️'}
        </div>
      </div>
    </div>
  );
}

export default App;