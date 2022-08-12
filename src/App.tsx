import { useCallback } from 'react';
import { useEffect, useState } from 'react';

function CanMultiply({ canMultiply }: { canMultiply: boolean }) {
  if (!canMultiply) {
    return <div>Error: matrices not multipliable!</div>;
  }
  return <div></div>;
}

const getRowsClassName = (matrix: Matrix) => {
  if (matrix.length > 0) {
    return `grid-rows-${matrix.length}`;
  }
};

const getColsClassName = (matrix: Matrix) => {
  if (matrix.length > 0) {
    return `grid-cols-${matrix[0].length}`;
  }
};

type Matrix = number[][];

function App() {
  const [a, setA] = useState<number>(0);
  const [b, setB] = useState<number>(0);
  const [c, setC] = useState<number>(0);
  const [d, setD] = useState<number>(0);
  const [canMultiply, setCanMultiply] = useState<boolean>(false);
  const [matrix1, setMatrix1] = useState<Matrix>([[0]]);
  const [matrix2, setMatrix2] = useState<Matrix>([[0]]);
  const [resultMatrix, setResultMatrix] = useState<Matrix>([[0]]);

  const checkMatrixShapes = useCallback(
    (Matrix1Columns: number, Matrix2Rows: number) => {
      if (Matrix1Columns === Matrix2Rows) {
        setCanMultiply(true);
      } else {
        setCanMultiply(false);
      }
      setResultMatrix(generateMatrixArray(a, d, () => null));
    },
    [a, d]
  );

  const generateMatrixArray = (rows: number, columns: number, mapper: any) => {
    return Array(rows)
      .fill(undefined)
      .map(() => Array(columns).fill(undefined).map(mapper)) as Matrix;
  };

  const getDotProduct = (
    matrix1: Matrix,
    matrix2: Matrix,
    resultMatrix: Matrix
  ) => {
    let newResultMatrix = [...resultMatrix];
    for (let i = 0; i < matrix1.length; i++) {
      for (let j = 0; j < matrix2[0].length; j++) {
        for (let k = 0; k < matrix1[0].length; k++) {
          newResultMatrix[i][j] += matrix1[i][k] * matrix2[k][j];
        }
      }
    }
    setResultMatrix(newResultMatrix);
  };

  const handleChange = (
    matrix: Matrix,
    x: number,
    y: number,
    value: number
  ) => {
    const matrixStateMap: {
      [key: string]: React.Dispatch<React.SetStateAction<Matrix>>;
    } = {
      matrix1: setMatrix1,
      matrix2: setMatrix2,
    };

    let newMatrix = [...matrix];
    newMatrix[y][x] = value;
    const stateChanger = matrixStateMap[matrix.constructor.name];
    if (stateChanger) {
      stateChanger(newMatrix);
    }
  };

  const Grid = ({
    matrix,
    handleChange,
    readOnly,
  }: {
    matrix: Matrix;
    handleChange: any;
    readOnly: boolean;
  }) => {
    return (
      <div className='flex'>
        {matrix[0] && matrix[0].length > 0 && (
          <div
            className={`border grid overflow-hidden ${getRowsClassName(
              matrix
            )} ${getColsClassName(matrix)}`}
          >
            {matrix.map((row, rowIdx) =>
              row.map((value, colIdx) => (
                <Cell
                  key={`${rowIdx}-${colIdx}`}
                  onChange={(e) => {
                    handleChange(matrix, colIdx, rowIdx, e.target.value);
                  }}
                  value={value}
                  placeholder={`${rowIdx}-${colIdx}`}
                  readOnly={readOnly}
                />
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  const Cell = ({
    onChange,
    value,
    placeholder,
    readOnly,
  }: {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    value: number;
    placeholder: string;
    readOnly: boolean;
  }) => {
    return (
      <div className='border flex aspect-square'>
        <input
          type='number'
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          className='text-center overflow-hidden'
          readOnly={readOnly}
        />
      </div>
    );
  };

  useEffect(() => {
    checkMatrixShapes(b, c);
  }, [checkMatrixShapes, a, b, c, d]);

  useEffect(() => {
    setMatrix1(generateMatrixArray(a, b, () => null));
  }, [a, b]);

  useEffect(() => {
    setMatrix2(generateMatrixArray(c, d, () => null));
  }, [c, d]);

  const handleSubmit = () => {
    if (canMultiply) {
      getDotProduct(matrix1, matrix2, resultMatrix);
    }
  };

  return (
    <div className='max-h-screen'>
      <div className='flex justify-center gap-x-6 h-50'>
        <div className='w-2/5 flex flex-col'>
          <div className='flex flex-row gap-x-5 justify-center m-4 h-12'>
            <input
              type='number'
              onChange={(e) => setA(Math.abs(parseInt(e.target.value)))}
              className='border aspect-square text-center'
              min='0'
              max='12'
              step='1'
            />
            <div className='flex items-center'>x</div>
            <input
              type='number'
              onChange={(e) => setB(Math.abs(parseInt(e.target.value)))}
              className='border aspect-square text-center'
              min='0'
              max='12'
              step='1'
            />
          </div>
          <div className='flex justify-center px-12'>
            {
              <Grid
                matrix={matrix1}
                handleChange={handleChange}
                readOnly={false}
              />
            }
          </div>
        </div>
        <div className='w-1/5 flex flex-col'>
          <div className='m-4 flex flex-col justify-center'>
            <button type='submit' className='border' onClick={handleSubmit}>
              Submit
            </button>
            <div className='text-center'>
              <CanMultiply canMultiply={canMultiply} />
            </div>
          </div>
        </div>
        <div className='w-2/5 flex flex-col'>
          <div className='flex flex-row gap-x-5 justify-center m-4 h-12'>
            <input
              type='number'
              onChange={(e) => setC(Math.abs(parseInt(e.target.value)))}
              className='border aspect-square text-center'
              min='0'
              max='12'
              step='1'
            />
            <div className='flex items-center'>x</div>
            <input
              type='number'
              onChange={(e) => setD(Math.abs(parseInt(e.target.value)))}
              className='border aspect-square text-center'
              max='12'
              min='0'
              step='1'
            />
          </div>
          <div>
            <div className='flex justify-center px-12'>
              {
                <Grid
                  matrix={matrix2}
                  handleChange={handleChange}
                  readOnly={false}
                />
              }
            </div>
          </div>
        </div>
      </div>

      {canMultiply && (
        <div className='mt-4'>
          <div className='flex justify-center px-12 w-1/2 mx-auto'>
            <Grid
              matrix={resultMatrix}
              handleChange={handleChange}
              readOnly={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
