import { useEffect, useState } from 'react';
import './App.css';

function NotCompatible({ canMultiply }: any) {
  if (!canMultiply) {
    return <div>Error: matrices not multipliable!</div>;
  }
  return <div></div>;
}

function App() {
  const [A, setA] = useState<number>(0);
  const [B, setB] = useState<number>(0);
  const [C, setC] = useState<number>(0);
  const [D, setD] = useState<number>(0);
  const [canMultiply, setCanMultiply] = useState<boolean>(false);
  const [Matrix1, setMatrix1] = useState<Array<any>>([]);
  const [Matrix2, setMatrix2] = useState<Array<any>>([]);

  const CheckMatrixShapes = (Matrix1Columns, Matrix2Rows) => {
    // console.log(Matrix1Columns, Matrix2Rows)
    if (Matrix1Columns === Matrix2Rows) {
      setCanMultiply(true);
    } else {
      setCanMultiply(false);
    }
  };

  const generateMatrixArray = (rows: number, columns: number, mapper) => {
    return Array(rows)
      .fill()
      .map(() => Array(columns).fill().map(mapper));
  };

  const GenerateGrid = ({ Matrix, setMatrix }) => {
    console.log(Matrix);
    const display = (x, i, j) => (
      <div className='border' key={i}>
        <span className='bg-blue-500'>
          <input type='text' placeholder='x' />
        </span>
      </div>
    );
    let grid = Matrix.map((subarray, i, j) => (
      <div className='' key={[i, j]}>
        {subarray.map(display)}
      </div>
    ));
    return grid;
  };

  useEffect(() => {
    CheckMatrixShapes(B, C);
    setMatrix1(generateMatrixArray(A, B, () => null));
    setMatrix2(generateMatrixArray(C, D, () => null));
  }, [A, B, C, D]);

  const handleSubmit = () => {
    if (canMultiply) {
      console.log('multiplication successful');
    } else {
      console.log('not compatible');
    }
  };
  // need to use spread operator to set state i.e. setMatrix([...Matrix, []])?
  return (
    <div className=''>
      <div className='flex flex-row justify-center gap-x-6'>
        <div className='grid grid-rows-2 gap-x-10 w-1/2'>
          <div className='flex flex-row gap-x-1 justify-center'>
            <input
              type='number'
              onChange={(e) => setA(parseInt(e.target.value))}
              className='border'
            />
            <input
              type='number'
              onChange={(e) => setB(parseInt(e.target.value))}
              className='border'
            />
          </div>
          <div className='flex justify-center gap-x-5'>
            {Matrix1[0] && Matrix1[0].length > 0 && (
              <GenerateGrid Matrix={Matrix1} setMatrix={setMatrix1} />
            )}
          </div>
        </div>
        <div className='grid grid-rows-2'>
          <div className='border flex flex-row gap-x-1'>
            <input
              type='number'
              onChange={(e) => setC(parseInt(e.target.value))}
              className=''
            />
            x
            <input
              type='number'
              onChange={(e) => setD(parseInt(e.target.value))}
              className=''
            />
          </div>
          <div>
            <div className='flex justify-center gap-x-5'>
              {Matrix2[0] && Matrix2[0].length > 0 && (
                <GenerateGrid Matrix={Matrix2} setMatrix={setMatrix2} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center mt-10 gap-x-2'>
        <button type='submit' className='border' onClick={handleSubmit}>
          Submit
        </button>
        {A}x{B} {C}x{D}
      </div>
      <NotCompatible canMultiply={canMultiply} />
    </div>
  );
}

export default App;
