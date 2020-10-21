import { File } from '../files/file.entity';
import { FILE_REPOSITORY } from '../../core/constants';

export const fileProviders = [{
    provide: FILE_REPOSITORY,
    useValue: File,
}];