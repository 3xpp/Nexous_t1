import './styles.css';
import { render } from 'preact';
import { MasterTicketView } from './components/MasterTicketView';

render(<MasterTicketView projectId="default" />, document.getElementById('app')!);
