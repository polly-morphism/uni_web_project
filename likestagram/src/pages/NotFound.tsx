import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="">
      <Result
        status="404"
        title="404"
        subTitle="Вибачте, ця сторінка не існує"
        extra={
          <Button
            type="primary"
            className="bg-sky-500"
            onClick={() => navigate('/')}
          >
            На головну
          </Button>
        }
      />
    </div>
  );
};
