import './Stoper.scss';
import Header from '../../components/header/Header';
import InfoTile from '../../components/tiles/infoTile/InfoTile';
import ProjectTile from '../../components/tiles/projectTile/ProjectTile';
import TimeTracking from "./section/TimeTracking";
import RecentActivities from './section/RecentActivities';
import ManualEntry from './section/ManualEntry';
import { FaBriefcase, FaClock, FaCheckCircle, FaDollarSign } from 'react-icons/fa';

const mockProject = { title: "Rebranding", status: "W trakcie", client: "Tech Corp Solutions", description: "Stworzenie nowego logo...", email: "email@techcorp.com", phone: "+48 111 222 333", rate: "50 zł/h" };
const infoTilesData = [
    { icon: <FaBriefcase />, title: 'Aktywne projekty', value: 4, percentageChange: 12 },
    { icon: <FaClock />, title: 'Przepracowany czas', value: 4, percentageChange: -12 },
    { icon: <FaCheckCircle />, title: 'Ukończone projekty', value: 4, percentageChange: 22 },
    { icon: <FaDollarSign />, title: 'Zysk', value: '4 542 zł', percentageChange: 15 },
];

const Stoper = () => {
  return (
    <>
      <Header />
      <main className="stoper-grid">
        <div className="grid-item item-timer"><TimeTracking /></div>
        
        <div className="grid-item info-tiles-container">
          {infoTilesData.map((tile, index) => (
            <InfoTile key={index} {...tile} />
          ))}
        </div>
        
        <div className="grid-item item-current">
          <div className="widget">
            <h3 className="widget__title">Aktualne zlecenie</h3>
            <div className="current-task__input-wrapper">
              <input type="text" placeholder="Projekt..."/>
              <div className="current-task__icon">$</div>
            </div>
            <ProjectTile {...mockProject} />
          </div>
        </div>

        <div className="grid-item item-recent"><RecentActivities /></div>
        <div className="grid-item item-manual"><ManualEntry /></div>
      </main>
    </>
  )
}

export default Stoper;